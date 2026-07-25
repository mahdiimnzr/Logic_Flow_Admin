import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Check } from "react-feather";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ImageFallback from "../../../common/ImageFallback";
import courseImage from "../../../../assets/images/coursePng.png";
import { acceptCourseReserve } from "../../../../core/services/api/Users/users.service";

export const columns = (t) => [
  {
    name: t("Student"),
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
    name: t("StudentEmail"),
    sortable: true,
    minWidth: "200px",
    maxWidth: "300px",
    sortField: "studentEmail",
    selector: (row) => row.studentEmail,
    cell: (row) => <span className="fw-bolder">{row.studentEmail}</span>,
  },
  {
    name: t("ReserveStatus"),
    minWidth: "100px",
    maxWidth: "200px",
    sortable: true,
    sortField: "accept",
    selector: (row) => row.accept,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row.accept ? "light-success" : "light-secondary"}
        pill
      >
        {row.accept ? t("Accept") : t("NotAccept")}
      </Badge>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "20px",
    maxWidth: "130px",
    cell: (row) => {
      const { t } = useTranslation();
      const { courseId } = useParams();
      const queryClient = useQueryClient();
      const [modalOpen, setModalOpen] = useState(false);
      const [selectedGroup, setSelectedGroup] = useState(null);
      const [groupError, setGroupError] = useState("");

      const groupOptions = row?.groupId?.map((g) => ({
        value: g.groupId,
        label: `${g.groupName} (ظرفیت: ${g.groupCapacity})`,
      })) || [];

      const { mutate: acceptReserveMutate } = useMutation({
        mutationFn: acceptCourseReserve,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: [`CourseReserve-${courseId}`] });
            queryClient.invalidateQueries({ queryKey: [`CourseDetail-${courseId}`] });
            setModalOpen(false);
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const handleAccept = () => {
        if (!selectedGroup) {
          setGroupError(t("GroupRequired"));
          return;
        }

        acceptReserveMutate({
          courseId: courseId,
          courseGroupId: selectedGroup,
          studentId: row.studentId,
        });
      };

      const handleOpenModal = () => {
        setModalOpen(true);
        setSelectedGroup(null);
        setGroupError("");
      };

      return (
        <div className="d-flex align-items-center gap-1">
          {!row.accept && (
            <Check
              size={17}
              className="cursor-pointer"
              onClick={handleOpenModal}
            />
          )}

          <Modal
            unmountOnClose
            isOpen={modalOpen}
            toggle={() => setModalOpen(!modalOpen)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
              {t("CourseGroups")}
            </ModalHeader>
            <ModalBody>
              <Label for="group-select">{t("SelectGroup")}</Label>
              <Select
                isClearable={false}
                value={groupOptions.find((g) => g.value === selectedGroup) || null}
                options={groupOptions}
                className={`react-select ${groupError ? "is-invalid" : ""}`}
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(option) => {
                  setSelectedGroup(option?.value);
                  setGroupError("");
                }}
              />
              {groupError && (
                <div className="invalid-feedback d-block mt-25">
                  {groupError}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={() => setModalOpen(false)}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleAccept}>
                {t("ApplyStatus")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];