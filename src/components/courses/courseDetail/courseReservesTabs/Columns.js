import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";
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
import ImageFallback from "../../../common/ImageFallback";
import courseImage from "../../../../assets/images/coursePng.png";

export const columns = [
  {
    name: "Student",
    sortable: true,
    minWidth: "100px",
    maxWidth: "300px",
    sortField: "studentName",
    selector: (row) => row.studentName,
    cell: (row) => (
      <div className="d-flex align-items-center gap-1 text-truncate">
        <ImageFallback
          className="me-1"
          style={{ borderRadius: "100%", width: "32px", height: "32px" }}
          fallback={courseImage}
          src={row.studentphoto}
        />
        <Link
          to={`/Users/Detail/${row.studentId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{row.studentName}</span>
        </Link>
      </div>
    ),
  },
  {
    name: "Student Email",
    sortable: true,
    minWidth: "200px",
    maxWidth: "300px",
    sortField: "studentEmail",
    selector: (row) => row.studentEmail,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">{row.studentEmail}</span>
      </div>
    ),
  },
  {
    name: "ReserveStatus",
    minWidth: "100px",
    maxWidth: "200px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.accept,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <Badge
          className="text-capitalize"
          color={row.accept ? "light-success" : "light-secondary"}
          pill
        >
          {row.accept ? t("Accept") : t("NotAccept")}
        </Badge>
      );
    },
  },
  {
    name: "Actions",
    sortable: true,
    minWidth: "20px",
    maxWidth: "130px",
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

      const rolesList = row?.groupId?.map((value) => ({
        value: value.groupId,
        label: value.groupName + ` (ظرفیت دوره :${value.groupCapacity})`,
      }));

      const { mutate: acceptReserveMutate } = useMutation({
        mutationFn: acceptCourseReserve,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({
              queryKey: [`CourseReserve-${courseId}`],
            });
            queryClient.invalidateQueries({
              queryKey: [`CourseDetail-${courseId}`],
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
          {!row.accept && (
            <Button.Ripple onClick={handleToggle} color="warning" size="sm">
              {t("AcceptComment")}
            </Button.Ripple>
          )}

          <Modal
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
          </Modal>
        </div>
      );
    },
  },
];
