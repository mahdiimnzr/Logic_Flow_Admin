import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Cleave from "cleave.js/react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
  Input,
  InputGroup,
} from "reactstrap";
import { Edit, Trash } from "react-feather";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { removeCourseGroup, updateCourseGroup } from "../../../../core/services/api/CourseList/courseList.service";
import formDataConverter from "../../../../core/utils/formDataConvertor";

const validationSchema = Yup.object({
  GroupName: Yup.string().trim().required("CourseGroupNameRequired"),
  GroupCapacity: Yup.string().trim().required("CourseGroupCapacityRequired"),
});

export const columns = (t) => [
  {
    name: t("CourseGroup"),
    sortable: true,
    minWidth: "100px",
    maxWidth: "300px",
    sortField: "groupName",
    selector: (row) => row.groupName,
    cell: (row) => <span className="fw-bolder">{row.groupName}</span>,
  },
  {
    name: t("TeacherName"),
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "teacherName",
    selector: (row) => row.teacherName,
    cell: (row) => <span className="fw-bolder">{row.teacherName}</span>,
  },
  {
    name: t("GroupCapacity"),
    sortable: true,
    minWidth: "200px",
    maxWidth: "150px",
    sortField: "groupCapacity",
    selector: (row) => row.groupCapacity,
    cell: (row) => <span className="fw-bolder">{row.groupCapacity}</span>,
  },
  {
    name: t("Actions"),
    minWidth: "20px",
    maxWidth: "200px",
    cell: (row) => {
      const { t } = useTranslation();
      const { courseId } = useParams();
      const queryClient = useQueryClient();
      const [editModal, setEditModal] = useState(false);

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
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: removeCourseGroupMutate } = useMutation({
        mutationFn: removeCourseGroup,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: [`CourseGroup-${courseId}`] });
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
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
            queryClient.invalidateQueries({ queryKey: [`CourseGroup-${courseId}`] });
            setEditModal(false);
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        const formData = formDataConverter(data);
        updateCourseGroupMutate(formData);
      };

      return (
        <div className="d-flex align-items-center gap-1">
          <Edit
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setEditModal(true)}
          />
          <Trash
            size={17}
            className="cursor-pointer"
            onClick={() => {
              const formData = new FormData();
              formData.append("Id", row.groupId);
              removeCourseGroupMutate(formData);
            }}
          />

          <Modal
            unmountOnClose
            isOpen={editModal}
            toggle={() => setEditModal(!editModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setEditModal(!editModal)}>
              {t("EditGroup")}
            </ModalHeader>
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
                      <Input
                        id="GroupName"
                        placeholder={t("CourseGroupNamePlaceholder")}
                        invalid={!!errors.GroupName}
                        {...field}
                      />
                    )}
                  />
                  {errors.GroupName && (
                    <span className="invalid-feedback d-block">
                      {t(errors.GroupName.message)}
                    </span>
                  )}
                </Col>

                <Col sm="12">
                  <Label className="form-label" for="GroupCapacity">
                    {t("CourseGroupCapacity")}
                  </Label>
                  <Controller
                    name="GroupCapacity"
                    control={control}
                    render={({ field }) => (
                      <InputGroup className="input-group-merge">
                        <Cleave
                          className={`form-control ${errors.GroupCapacity ? "is-invalid" : ""}`}
                          placeholder={t("CourseGroupCapacityPlaceholder")}
                          options={{ numeral: true, numeralThousandsGroupStyle: "thousand" }}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                    )}
                  />
                  {errors.GroupCapacity && (
                    <span className="invalid-feedback d-block">
                      {t(errors.GroupCapacity.message)}
                    </span>
                  )}
                </Col>
              </form>
            </ModalBody>
            <ModalFooter className="d-flex align-items-center justify-content-between">
              <Button color="secondary" outline onClick={() => setEditModal(false)}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmit)}>
                {t("SaveChanges")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];