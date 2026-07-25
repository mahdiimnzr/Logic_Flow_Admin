import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Check, Eye } from "react-feather";
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
import { acceptCourseReserve } from "../../core/services/api/Users/users.service";
import formatPrice from "../../core/utils/formatPrice";
import ImageFallback from "../common/ImageFallback";
import courseImage from "../../assets/images/coursePng.png";

export const columns = (t) => [
  {
    name: t("CourseTitle"),
    sortable: true,
    minWidth: "300px",
    sortField: "title",
    selector: (row) => row.title,
    cell: (row) => {
      const { t } = useTranslation();

      return (
        <div className="d-flex align-items-center gap-1 text-truncate">
          <ImageFallback
            className="me-1"
            style={{ borderRadius: "100%", width: "32px", height: "32px" }}
            fallback={courseImage}
            src={row.imageAddress}
          />

          <Link
            to={`/Courses/Detail/${row.courseId}`}
            className="user_name text-body text-truncate"
          >
            <span className="fw-bolder text-truncate">{row.title}</span>
          </Link>
        </div>
      );
    },
  },
  {
    name: t("Teacher"),
    sortable: true,
    minWidth: "200px",
    sortField: "teacher",
    selector: (row) => row.teacherName,
    cell: (row) => (
      <div className="d-flex flex-column">
        <Link
          to={`/Users/Detail/${row.teacherId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{row.teacherName}</span>
        </Link>
      </div>
    ),
  },
  {
    name: t("CourseCost"),
    sortable: true,
    minWidth: "200px",
    sortField: "cost",
    selector: (row) => row.cost,
    cell: (row) => {
      const { t } = useTranslation();

      return (
        <div className="d-flex flex-column">
          <span className="fw-bolder">
            {formatPrice(row.cost)} {t("Toman")}
          </span>
        </div>
      );
    },
  },
  {
    name: t("CourseCapacity"),
    sortable: true,
    minWidth: "200px",
    sortField: "capacity",
    selector: (row) => row.capacity,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">{formatPrice(row.capacity)}</span>
      </div>
    ),
  },
  {
    name: t("CourseStatus"),
    sortable: true,
    minWidth: "200px",
    sortField: "courseStatusName",
    selector: (row) => row.courseStatusName,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">{row.courseStatusName}</span>
      </div>
    ),
  },
  {
    name: t("ReserveStatus"),
    minWidth: "60px",
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
    name: t("Actions"),
    sortable: true,
    minWidth: "20px",
    sortField: "capacity",
    selector: (row) => row.capacity,
    cell: (row) => {
      const { t } = useTranslation();
      const { userId } = useParams();
      const queryClient = useQueryClient();
      const [centeredModal, setCenteredModal] = useState(false);
      const [groupError, setGroupError] = useState("");

      const [currentRole, setCurrentRole] = useState({
        value: null,
        label: t("SelectGroup"),
      });

      const rolesList = row?.groupId?.map((value) => ({
        value: value.groupId,
        label: `${value.groupName} (${t("CourseCapacity")} : ${
          value.groupCapacity
        })`,
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
              queryKey: [`UserDetail-${userId}`],
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

      const handleSubmit = () => {
        if (!currentRole.value) {
          setGroupError(t("GroupRequired"));
          return;
        }

        acceptReserveMutate({
          courseId: row.courseId,
          courseGroupId: currentRole.value,
          studentId: userId,
        });
      };

      const handleToggle = () => {
        setCenteredModal(!centeredModal);
        setGroupError("");
        setCurrentRole({
          value: null,
          label: t("SelectGroup"),
        });
      };

      return (
        <div className="d-flex align-items-center gap-1">
          <Link
            className="d-flex align-items-center"
            to={`/Courses/Detail/${row?.courseId}`}
          >
            <Eye size={17} />
          </Link>

          {!row.accept && (
            <Check
              className="cursor-pointer"
              size={17}
              onClick={handleToggle}
            />
          )}

          <Modal
            unmountOnClose
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
