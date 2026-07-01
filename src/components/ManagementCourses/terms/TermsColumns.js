// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Icons Imports

// ** Reactstrap Imports
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";
import { useGetTerm } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";
import formatDate from "../../../core/utils/formatDate";
import { AlignJustify, MoreVertical, TrendingUp } from "react-feather";

// ** Renders Client Columns
const renderClient = (row) => {
  if (row?.currentPictureAddress) {
    return (
      <ImageFallback
        className="me-1"
        style={{ borderRadius: "100%", width: "32px", height: "32px" }}
        src={row?.currentPictureAddress}
        fallback={profile}
      />
    );
  } else {
    return (
      <Avatar
        initials
        className="me-1"
        color={row.avatarColor || "light-primary"}
        content={
          row?.fName?.toUpperCase() + row?.lName?.toUpperCase() || "Unknown"
        }
      />
    );
  }
};

// ** Renders Role Columns
const renderRole = (row) => {
  return (
    <span className={`text-truncate text-capitalize align-middle text-primary`}>
      {/* {row.roles.join(", ")} */}
    </span>
  );
};

const statusObj = {
  active: "light-success",
  deActive: "light-danger",
};

export const columns = [
  {
    name: "#آیدی",
    sortable: true,
    sortField: "id",
    minWidth: "107px",
    selector: (row) => row.id,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.id}</span>
    ),
  },
  {
    name: "نام ترم ها",
    sortable: true,
    minWidth: "200px",
    sortField: "role",
    selector: (row) => row.termName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.termName}</span>
    ),
  },

  {
    name: "تاریخ شروع / پایان",
    minWidth: "80px",
    sortable: true,
    sortField: "insertDate",
    selector: (row) => row.insertDate,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {formatDate(row.startDate)} تا {formatDate(row.endDate)}
      </span>
    ),
  },
  {
    name: "وضعیت",
    minWidth: "138px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.active,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <Badge
          className="text-capitalize"
          color={row?.expire ? statusObj.active : statusObj.deActive}
          pill
        >
          {row.expire ? "  منقضی نشده " : "منقضی شده "}
        </Badge>
      );
    },
  },
  // {
  //   name: "isDelete",
  //   minWidth: "80px",
  //   sortable: true,
  //   sortField: "isDelete",
  //   selector: (row) => row.isDelete,
  //   cell: (row) => {
  //     const { t } = useTranslation();
  //     return (
  //       <Badge
  //         className="text-capitalize"
  //         color={row.isDelete ? statusObj.active : statusObj.deActive}
  //         pill
  //       >
  //         {row.isDelete ? t("Deleted") : t("NotDeleted")}
  //       </Badge>
  //     );
  //   },
  // },
  {
    name: "اقدام",
    minWidth: "300px",
    cell: (row) => {
      const { t } = useTranslation();
      const navigate = useNavigate();
      const queryClient = useQueryClient();
      const { data: termList } = useGetTerm();
      const [centeredModal, setCenteredModal] = useState(false);
      const [currentRole, setCurrentRole] = useState({
        value: "",
        label: t("RolesSelection"),
      });
      const [currentAccess, setCurrentAccess] = useState(false);
      // ** User filter options
      const rolesList = termList?.data?.map((value) => {
        const roles = { value: value.id, label: value.name };
        return roles;
      });
      const roleOptions = [...(rolesList ?? [])];
      // ** Handle Submit
      // const { mutate: accessUserMutate } = useMutation({
      //   mutationFn: addUserAccess,
      //   onMutate: () => {
      //     const toastId = toast.loading(t("Loading"));
      //     return { toastId };
      //   },
      //   onSuccess: (response, _, context) => {
      //     if (response.data.success) {
      //       setCenteredModal(!centeredModal);
      //       toast.success(response.data.message, { id: context.toastId });
      //       queryClient.invalidateQueries({
      //         queryKey: [`UsersList`],
      //       });
      //     } else {
      //       toast.error(response.data.message, { id: context.toastId });
      //     }
      //   },
      //   onError: (response, _, context) => {
      //     toast.error(response.data.message, { id: context.toastId });
      //   },
      // });
      return (
        <div className="column-action d-flex gap-1">
          <UncontrolledDropdown>
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
                  setCenteredModal(!centeredModal);
                }}
              >
                <AlignJustify size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
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
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
              {/* <Modal
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
                    // defaultValue={{
                    //   value: row.statusId,
                    //   label: fundedStatus?.statusName,
                    // }}
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
              </Modal> */}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    },
  },
];
