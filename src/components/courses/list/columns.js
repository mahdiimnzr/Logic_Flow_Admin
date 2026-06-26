// ** React Imports
import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Button,
  ModalFooter,
} from "reactstrap";

// ** Third Party Components
import {
  Eye,
  Send,
  Edit,
  Copy,
  Save,
  Info,
  Trash,
  PieChart,
  Download,
  TrendingUp,
  CheckCircle,
  MoreVertical,
  ArrowDownCircle,
  Server,
  Activity,
  AlignJustify,
} from "react-feather";
import formatPrice from "../../../core/utils/formatPrice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  activeCourse,
  updateCourseStatus,
  useGetCourseList,
  useGetStatus,
} from "../../../core/services/api/CourseList/courseList.service";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import formDataConverter from "../../../core/utils/formDataConvertor";
import formatDate from "../../../core/utils/formatDate";

// ** Vars
const invoiceStatusObj = {
  Sent: { color: "light-secondary", icon: Send },
  Paid: { color: "light-success", icon: CheckCircle },
  Draft: { color: "light-primary", icon: Save },
  Downloaded: { color: "light-info", icon: ArrowDownCircle },
  "Past Due": { color: "light-danger", icon: Info },
  "Partial Payment": { color: "light-warning", icon: PieChart },
};

// ** renders client column
const renderClient = (row) => {
  const stateNum = Math.floor(Math.random() * 6),
    states = [
      "light-success",
      "light-danger",
      "light-warning",
      "light-info",
      "light-primary",
      "light-secondary",
    ],
    color = states[stateNum];

  if (row?.imageAddress?.length) {
    return (
      <Avatar
        className="me-50"
        img={row?.imageAddress}
        width="32"
        height="32"
      />
    );
  } else {
    return (
      <Avatar
        color={color}
        className="me-50"
        content={row?.client ? row?.client?.name : "John Doe"}
        initials
      />
    );
  }
};
// ** Table columns
export const columns = [
  {
    name: "مدرس",
    sortable: true,
    sortField: "id",
    minWidth: "107px",
    cell: (row) => (
      <Link to={`/Courses/Detail/${row?.courseId}`}>{`${row?.fullName}`}</Link>
    ),
  },

  {
    name: "نام دوره",
    sortable: true,
    minWidth: "350px",
    sortField: "client.name",
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center">
          {renderClient(row)}
          <div className="d-flex flex-column">
            <h6 className="user-name text-truncate mb-0">{row?.title}</h6>
            <small className="text-truncate text-muted mb-0">
              {row?.miniDescribe}
            </small>
          </div>
        </div>
      );
    },
  },
  {
    name: "قیمت",
    sortable: true,
    minWidth: "150px",
    sortField: "total",
    // selector: row => row.total,
    cell: (row) => <span>{formatPrice(row?.cost) || 0} تومان</span>,
  },
  {
    sortable: true,
    minWidth: "200px",
    name: "آخرین بروزرسانی",
    sortField: "dueDate",
    cell: (row) => formatDate(row?.lastUpdate),
    // selector: row => row.dueDate
  },
  {
    sortable: true,
    name: "دوره های فعال و غیر فعال",
    minWidth: "164px",
    sortField: "balance",
    // selector: row => row.balance,
    selector: (row) => row?.active,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row?.active ? "light-success" : "light-primary"}
        pill
      >
        {row?.active ? "فعال" : "غیر فعال"}
      </Badge>
    ),
  },
  {
    name: "عملیات",
    minWidth: "110px",
    cell: (row) => {
      const { t } = useTranslation();
      const params = useSelector((state) => state.courseListSlice.params);
      const queryClient = useQueryClient();
      const { data: Status } = useGetStatus(params);
      const { mutate: activeCourseMutate } = useMutation({
        mutationFn: activeCourse,
        onSuccess: (response) => {
          if (response?.data?.success === true) {
            toast.success(response?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["CourseList"] });
          } else {
            toast.error(response?.data?.message);
          }
        },
        onError: (response) => {
          toast.error(response?.data?.message);
        },
      });
      const { mutate: updateStatusCourseMutate } = useMutation({
        mutationFn: updateCourseStatus,
        onSuccess: (response) => {
          if (response?.data?.success === true) {
            toast.success(response?.data?.message);
            queryClient.invalidateQueries({ queryKey: ["CourseList"] });
            setCenteredModal(false);
          } else {
            toast.error(response?.data?.message);
          }
        },
        onError: (response) => {
          toast.error(response?.data?.message);
        },
      });
      const [centeredModal, setCenteredModal] = useState(false);
      const fundedStatus = Status?.data?.find(
        (value) => value.id == row.statusId,
      );
      const [currentRole, setCurrentRole] = useState({
        value: row.statusId,
        label: fundedStatus?.statusName,
      });
      const rolesList = Status?.data?.map((value) => {
        const roles = { value: value.id, label: value.statusName };
        return roles;
      });
      const roleOptions = [...(rolesList ?? [])];
      return (
        <div className="column-action d-flex align-items-center">
          <Link
            to={`/Courses/Detail/${row?.courseId}`}
            id={`pw-tooltip-${row?.courseId}`}
          >
            <Eye size={17} className="mx-1" />
          </Link>
          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <MoreVertical size={17} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem
                tag={Link}
                to={`/apps/invoice/edit/${row?.id}`}
                className="w-100"
              >
                <Edit size={14} className="me-50" />
                <span className="align-middle">Edit</span>
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  activeCourseMutate({
                    active: row.active === true ? false : true,
                    id: row.courseId,
                  });
                }}
              >
                <TrendingUp size={14} className="me-50" />
                <span className="align-middle">
                  {row.active == true ? "غیر فعال" : "فعال"}
                </span>
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  setCenteredModal(!centeredModal);
                }}
              >
                <AlignJustify size={14} className="me-50" />
                <span className="align-middle">وضعیت ها</span>
              </DropdownItem>

              <Modal
                unmountOnClose={true}
                isOpen={centeredModal}
                toggle={() => setCenteredModal(!centeredModal)}
                className="modal-dialog-centered"
                style={{ fontFamily: "IRANYekanXFaNum" }}
              >
                <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
                  وضعیت برگذاری دوره ها
                </ModalHeader>
                <ModalBody>
                  <Label for="role-select">وضعیت ها</Label>
                  <Select
                    isClearable={false}
                    value={currentRole}
                    defaultValue={{
                      value: row.statusId,
                      label: fundedStatus?.statusName,
                    }}
                    options={roleOptions}
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    onChange={(data) => {
                      setCurrentRole(data);
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => {
                      const values = {
                        CourseId: row.courseId,
                        StatusId: currentRole.value,
                      };
                      const formData = formDataConverter(values);
                      currentRole.value == ""
                        ? null
                        : updateStatusCourseMutate(formData);
                    }}
                  >
                    اعمال وضعیت
                  </Button>
                </ModalFooter>
              </Modal>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    },
  },
];
