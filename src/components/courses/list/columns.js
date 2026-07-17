import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@components/avatar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Button,
  ModalFooter,
  UncontrolledTooltip,
} from "reactstrap";
import {
  Eye,
  Edit,
  TrendingUp,
  MoreVertical,
  AlignJustify,
} from "react-feather";
import formatPrice from "../../../core/utils/formatPrice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  activeCourse,
  updateCourseStatus,
} from "../../../core/services/api/CourseList/courseList.service";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import formDataConverter from "../../../core/utils/formDataConvertor";
import formatDate from "../../../core/utils/formatDate";
import ImageFallback from "../../common/ImageFallback";
import userImage from "/Profile.png";

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
      <ImageFallback
        className="me-50"
        style={{ borderRadius: "100%", width: "32px", height: "32px" }}
        fallback={userImage}
        src={row?.imageAddress}
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

export const columns = (t) => [
  {
    name: t("CourseTitle"),
    sortable: true,
    minWidth: "200px",
    sortField: "client.name",
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center text-truncate">
          {renderClient(row)}
          <div className="d-flex flex-column text-truncate">
            <Link
              to={`/Courses/Detail/${row?.courseId}`}
              className="user-name text-truncate mb-0"
            >
              {row?.title}
            </Link>
            <small className="text-muted text-truncate mb-0">
              {row?.miniDescribe}
            </small>
          </div>
        </div>
      );
    },
  },
  {
    name: t("Teacher"),
    sortable: true,
    sortField: "id",
    minWidth: "107px",
    cell: (row) => (
      <Link to={`/Users/Detail/${row?.teacherId}`}>{row?.fullName}</Link>
    ),
  },
  {
    name: t("CourseCost"),
    sortable: true,
    minWidth: "150px",
    sortField: "total",
    cell: (row) => (
      <span>
        {formatPrice(row?.cost) || 0} {t("Toman")}
      </span>
    ),
  },
  {
    sortable: true,
    minWidth: "200px",
    name: t("InsertDate"),
    sortField: "dueDate",
    cell: (row) => formatDate(row?.lastUpdate),
  },
  {
    sortable: true,
    name: t("CourseStatus"),
    minWidth: "164px",
    sortField: "balance",
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
    name: t("Actions"),
    minWidth: "110px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();
      const Status = queryClient.getQueryState(["CourseStatus"]);
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
      const fundedStatus = Status?.data?.data?.find(
        (value) => value.id == row.statusId,
      );
      const [currentRole, setCurrentRole] = useState({
        value: row.statusId,
        label: fundedStatus?.statusName,
      });
      const rolesList = Status?.data?.data?.map((value) => {
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
            <Eye id={`Eye-${row.courseId}`} size={17} className="mx-1" />
          </Link>
          <UncontrolledTooltip placement="top" target={`Eye-${row.courseId}`}>
            جزئیات دوره
          </UncontrolledTooltip>
          <Link to={`/Courses/Edit/${row?.courseId}`}>
            <Edit id={`Edit-${row.courseId}`} size={17} className="me-50" />
          </Link>
          <UncontrolledTooltip placement="top" target={`Edit-${row.courseId}`}>
            ویرایش دوره
          </UncontrolledTooltip>

          <UncontrolledDropdown direction="up">
            <DropdownToggle tag="span">
              <MoreVertical size={17} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu end>
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
                  {row.active == true ? t("DeActive") : t("Active")}
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
                <span className="align-middle">{t("CourseStatus")}</span>
              </DropdownItem>
              <Modal
                unmountOnClose={true}
                isOpen={centeredModal}
                toggle={() => setCenteredModal(!centeredModal)}
                className="modal-dialog-centered"
                style={{ fontFamily: "IRANYekanXFaNum" }}
              >
                <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
                  {t("CourseStatus")}
                </ModalHeader>
                <ModalBody>
                  <Label for="role-select">{t("CourseStatusId")}</Label>
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
                    {t("ApplyStatus")}
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
