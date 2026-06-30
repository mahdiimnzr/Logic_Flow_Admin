import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
  Input,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  removeCourseGroup,
  updateCourseGroup,
} from "../../../../core/services/api/CourseList/courseList.service";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import formDataConverter from "../../../../core/utils/formDataConvertor";

const validationSchema = Yup.object({
  GroupName: Yup.string().required("CourseGroupNameRequired"),
  GroupCapacity: Yup.string().required("CourseGroupCapacityRequired"),
});

export const columns = [
  {
    name: "CourseGroup",
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
    name: "TeacherName",
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
    name: "GroupCapacity",
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

      const defaultValues = {
        Id: row.groupId ?? "",
        CourseId: courseId ?? "",
        GroupName: row.groupName ?? "",
        GroupCapacity: row.groupCapacity ?? "",
      };

      const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

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

      const { mutate: updateCourseGroupMutate } = useMutation({
        mutationFn: updateCourseGroup,
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

      const onSubmit = (data) => {
        const formData = formDataConverter(data);
        updateCourseGroupMutate(formData);
      };

      const handleToggle = () => setCenteredModal(!centeredModal);

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

          <Modal
            unmountOnClose={true}
            isOpen={centeredModal}
            toggle={handleToggle}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={handleToggle}>{t("CourseGroups")}</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="GroupName">
                    {t("CourseGroupName")}
                  </Label>
                  <Controller
                    name="GroupName"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          id="GroupName"
                          placeholder={t("CourseGroupNamePlaceholder")}
                          invalid={!!errors.GroupName}
                          {...field}
                        />
                        {errors.GroupName && (
                          <div className="invalid-feedback d-block">
                            {t(errors.GroupName.message)}
                          </div>
                        )}
                      </>
                    )}
                  />
                </Col>
                <Col sm="12">
                  <Label className="form-label" for="GroupCapacity">
                    {t("CourseGroupCapacity")}
                  </Label>
                  <Controller
                    name="GroupCapacity"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          id="GroupCapacity"
                          placeholder={t("CourseGroupCapacityPlaceholder")}
                          invalid={!!errors.GroupCapacity}
                          {...field}
                        />
                        {errors.GroupCapacity && (
                          <div className="invalid-feedback d-block">
                            {t(errors.GroupCapacity.message)}
                          </div>
                        )}
                      </>
                    )}
                  />
                </Col>
              </form>
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
              <Button color="secondary" outline onClick={handleToggle}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmit)}>
                {t("ApplyStatus")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];
