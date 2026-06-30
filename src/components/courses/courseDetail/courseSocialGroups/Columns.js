import { Link, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ExternalLink } from "react-feather";
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
import { updateCourseSocialGroup } from "../../../../core/services/api/CourseList/courseList.service";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const validationSchema = Yup.object({
  groupName: Yup.string().required("SocialGroupNameRequired"),
  groupLink: Yup.string()
    .url("SocialGroupLinkInvalid")
    .required("SocialGroupLinkRequired"),
});

export const columns = [
  {
    name: "SocialGroupName",
    sortable: true,
    minWidth: "150px",
    maxWidth: "400px",
    sortField: "groupName",
    selector: (row) => row.groupName,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <span
          className="fw-bolder text-truncate d-block w-100"
          style={{ minWidth: 0 }}
        >
          {row.groupName}
        </span>
      );
    },
  },
  {
    name: "SocialGroupLink",
    sortable: true,
    minWidth: "200px",
    maxWidth: "300px",
    sortField: "groupLink",
    selector: (row) => row.groupLink,
    cell: (row) => (
      <Link
        to={row.groupLink}
        target="_blank"
        className="d-flex align-items-center gap-50 text-primary w-100"
        style={{ minWidth: 0 }}
      >
        <ExternalLink size={14} style={{ flexShrink: 0 }} />
        <span className="text-truncate" style={{ minWidth: 0 }}>
          {row.groupLink}
        </span>
      </Link>
    ),
  },
  {
    name: "CourseTitle",
    sortable: true,
    minWidth: "150px",
    maxWidth: "300px",
    sortField: "courseTitle",
    selector: (row) => row.course?.title,
    cell: (row) => (
      <span
        className="fw-bolder text-truncate d-block w-100"
        style={{ minWidth: 0 }}
      >
        {row.course?.title ?? "-"}
      </span>
    ),
  },
  {
    name: "Actions",
    minWidth: "100px",
    cell: (row) => {
      const { t } = useTranslation();
      const { courseId } = useParams();
      const queryClient = useQueryClient();
      const [centeredModal, setCenteredModal] = useState(false);

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
      } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

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
        updateSocialGroupMutate(data);
      };

      const handleToggle = () => setCenteredModal(!centeredModal);

      return (
        <div className="d-flex align-items-center gap-1">
          <Button.Ripple onClick={handleToggle} color="primary" size="sm">
            {t("Edit")}
          </Button.Ripple>

          <Modal
            unmountOnClose={true}
            isOpen={centeredModal}
            toggle={handleToggle}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={handleToggle}>
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
                      <>
                        <Input
                          id="groupName"
                          placeholder={t("SocialGroupNamePlaceholder")}
                          invalid={!!errors.groupName}
                          {...field}
                        />
                        {errors.groupName && (
                          <div className="invalid-feedback d-block">
                            {t(errors.groupName.message)}
                          </div>
                        )}
                      </>
                    )}
                  />
                </Col>
                <Col sm="12">
                  <Label className="form-label" for="groupLink">
                    {t("SocialGroupLink")}
                  </Label>
                  <Controller
                    name="groupLink"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          id="groupLink"
                          placeholder={t("SocialGroupLinkPlaceholder")}
                          invalid={!!errors.groupLink}
                          {...field}
                        />
                        {errors.groupLink && (
                          <div className="invalid-feedback d-block">
                            {t(errors.groupLink.message)}
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
