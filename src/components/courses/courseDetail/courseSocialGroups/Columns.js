import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
import { Edit } from "react-feather";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateCourseSocialGroup } from "../../../../core/services/api/CourseList/courseList.service";

const validationSchema = Yup.object({
  groupName: Yup.string().trim().required("SocialGroupNameRequired"),
  groupLink: Yup.string()
    .url("SocialGroupLinkInvalid")
    .trim()
    .required("SocialGroupLinkRequired"),
});

export const columns = (t) => [
  {
    name: t("SocialGroupName"),
    sortable: true,
    minWidth: "150px",
    maxWidth: "400px",
    sortField: "groupName",
    selector: (row) => row.groupName,
    cell: (row) => <span className="fw-bolder text-truncate">{row.groupName}</span>,
  },
  {
    name: t("SocialGroupLink"),
    sortable: true,
    minWidth: "200px",
    maxWidth: "300px",
    sortField: "groupLink",
    selector: (row) => row.groupLink,
    cell: (row) => (
      <a
        href={row.groupLink}
        target="_blank"
        rel="noopener noreferrer"
        className="d-flex align-items-center gap-50 text-primary"
      >
        <span className="text-truncate">{row.groupLink}</span>
      </a>
    ),
  },
  {
    name: t("CourseTitle"),
    sortable: true,
    minWidth: "150px",
    maxWidth: "300px",
    sortField: "courseTitle",
    selector: (row) => row.course?.title,
    cell: (row) => (
      <span className="fw-bolder text-truncate">{row.course?.title ?? "-"}</span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "100px",
    cell: (row) => {
      const { t } = useTranslation();
      const { courseId } = useParams();
      const queryClient = useQueryClient();
      const [editModal, setEditModal] = useState(false);

      const defaultValues = {
        id: row.id ?? "",
        groupName: row.groupName ?? "",
        groupLink: row.groupLink ?? "",
        courseId: courseId ?? "",
      };

      const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: updateSocialGroupMutate } = useMutation({
        mutationFn: updateCourseSocialGroup,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["CourseSocialGroups"] });
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
        updateSocialGroupMutate(data);
      };

      return (
        <div className="d-flex align-items-center gap-1">
          <Edit
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setEditModal(true)}
          />

          <Modal
            unmountOnClose
            isOpen={editModal}
            toggle={() => setEditModal(!editModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setEditModal(!editModal)}>
              {t("EditSocialGroup")}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="groupName">
                    {t("SocialGroupName")}
                  </Label>
                  <Controller
                    name="groupName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="groupName"
                        placeholder={t("SocialGroupNamePlaceholder")}
                        invalid={!!errors.groupName}
                        {...field}
                      />
                    )}
                  />
                  {errors.groupName && (
                    <div className="invalid-feedback d-block">
                      {t(errors.groupName.message)}
                    </div>
                  )}
                </Col>

                <Col sm="12">
                  <Label className="form-label" for="groupLink">
                    {t("SocialGroupLink")}
                  </Label>
                  <Controller
                    name="groupLink"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="groupLink"
                        placeholder={t("SocialGroupLinkPlaceholder")}
                        invalid={!!errors.groupLink}
                        {...field}
                      />
                    )}
                  />
                  {errors.groupLink && (
                    <div className="invalid-feedback d-block">
                      {t(errors.groupLink.message)}
                    </div>
                  )}
                </Col>
              </form>
            </ModalBody>
            <ModalFooter>
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