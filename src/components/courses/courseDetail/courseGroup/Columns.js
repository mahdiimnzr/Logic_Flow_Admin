import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Eye } from "react-feather";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { acceptCourseReserve } from "../../../../core/services/api/Users/users.service";
import formatPrice from "../../../../core/utils/formatPrice";
import ImageFallback from "../../../common/ImageFallback";
import courseImage from "../../../../assets/images/coursePng.png";
import {
  removeCourseGroup,
  updateCourseGroup,
} from "../../../../core/services/api/CourseList/courseList.service";

export const columns = [
  {
    name: "Group",
    sortable: true,
    minWidth: "100px",
    maxWidth: "300px",
    sortField: "groupName",
    selector: (row) => row.groupName,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <div className="d-flex align-items-center gap-1 text-truncate">
          <span className="fw-bolder">{row.groupName}</span>
        </div>
      );
    },
  },
  {
    name: "Teacher Name",
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "teacherName",
    selector: (row) => row.teacherName,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.teacherName}</span>
        </div>
      );
    },
  },
  {
    name: "Group Capacity",
    sortable: true,
    minWidth: "200px",
    maxWidth: "150px",
    sortField: "groupCapacity",
    selector: (row) => row.groupCapacity,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.groupCapacity}</span>
        </div>
      );
    },
  },
  {
    name: "Actions",
    sortable: true,
    minWidth: "20px",
    maxWidth: "200px",
    sortField: "capacity",
    selector: (row) => row.capacity,
    cell: (row) => {
      const { t } = useTranslation();
      const { courseId } = useParams();
      const queryClient = useQueryClient();
      const [centeredModal, setCenteredModal] = useState(false);
      const [groupError, setGroupError] = useState("");
      const [currentRole, setCurrentRole] = useState({
        value: null,
        label: t("SelectGroup"),
      });

      // const rolesList = row?.groupId?.map((value) => ({
      //   value: value.groupId,
      //   label: value.groupName + ` (ظرفیت دوره :${value.groupCapacity})`,
      // }));

      const { mutate: removeCourseGroupMutate } = useMutation({
        mutationFn: removeCourseGroup,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({
              queryKey: [`CourseGroup-${courseId}`],
            });
            setCenteredModal(false);
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (response, _, context) => {
          toast.error(response.data.message, { id: context.toastId });
        },
      });

      const handleRoleChange = (data) => {
        setCurrentRole(data);
        if (data?.value) setGroupError("");
      };

      const handleSubmit = (data) => {
        if (!currentRole.value) {
          setGroupError(t("GroupRequired"));
          return;
        }
        acceptReserveMutate({
          courseId: courseId,
          courseGroupId: currentRole.value ? currentRole.value : "",
          studentId: row.studentId,
        });
      };

      const handleToggle = () => {
        setCenteredModal(!centeredModal);
        setGroupError("");
        setCurrentRole({ value: null, label: t("SelectGroup") });
      };

      return (
        <div className="d-flex align-items-center gap-1">
          <Button.Ripple onClick={handleToggle} color="primary" size="sm">
            {t("Edit")}
          </Button.Ripple>
          <Button.Ripple
            onClick={() => {
              const formData = new FormData();
              formData.append("Id", row.groupId);
              removeCourseGroupMutate(formData);
            }}
            color="danger"
            size="sm"
          >
            {t("Remove")}
          </Button.Ripple>

          {/* <Modal
            unmountOnClose={true}
            isOpen={centeredModal}
            toggle={handleToggle}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={handleToggle}>{t("CourseGroups")}</ModalHeader>
            <ModalBody>
              <Label for="role-select">{t("SelectGroup")}</Label>
              <Select
                isClearable={false}
                value={currentRole}
                options={rolesList}
                className={`react-select ${groupError ? "is-invalid" : ""}`}
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={handleRoleChange}
              />
              {groupError && (
                <div className="invalid-feedback d-block mt-25">
                  {groupError}
                </div>
              )}
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
              <Button color="secondary" outline onClick={handleToggle}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                {t("ApplyStatus")}
              </Button>
            </ModalFooter>
          </Modal> */}
        </div>
      );
    },
  },
];
