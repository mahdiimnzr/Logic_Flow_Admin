import { Link } from "react-router-dom";
import { Eye, Check, Send } from "react-feather";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Col,
  Row,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  acceptCourseComment,
  addReplyComment,
} from "../../core/services/api/Comments/comments.service";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import formDataConverter from "../../core/utils/formDataConvertor";

const statusObj = {
  active: "light-success",
  deActive: "light-secondary",
};

const validationSchema = Yup.object({
  Title: Yup.string().trim().required("TitleRequired"),
  Describe: Yup.string().trim().required("DescribeRequired"),
});

export const columns = (t) => [
  {
    name: t("Writer"),
    minWidth: "50px",
    sortable: true,
    sortField: "author",
    selector: (row) => row.author,
    cell: (row) => (
      <div className="d-flex flex-column">
        <Link
          to={`/Users/Detail/${row.userId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{row.author}</span>
        </Link>
      </div>
    ),
  },
  {
    name: t("CommentTitle"),
    minWidth: "80px",
    sortable: true,
    sortField: "commentTitle",
    selector: (row) => row.commentTitle,
    cell: (row) => (
      <span className="fw-bolder text-truncate">{row.commentTitle}</span>
    ),
  },
  {
    name: t("CommentDescribe"),
    minWidth: "200px",
    sortable: true,
    sortField: "describe",
    selector: (row) => row.describe,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.describe}</span>
    ),
  },
  {
    name: t("Status"),
    minWidth: "50px",
    sortable: true,
    sortField: "accept",
    selector: (row) => row.accept,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row.accept ? statusObj.active : statusObj.deActive}
        pill
      >
        {row.accept ? t("Accept") : t("NotAccept")}
      </Badge>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "150px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();
      const [detailModal, setDetailModal] = useState(false);
      const [replyModal, setReplyModal] = useState(false);

      const defaultValues = {
        CommentId: row.id,
        CourseId: row.courseId,
        Title: "",
        Describe: "",
      };

      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: acceptCommentMutate } = useMutation({
        mutationFn: acceptCourseComment,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["CourseCommentsList"] });
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });
      const { mutate: addReplyMutate } = useMutation({
        mutationFn: addReplyComment,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            setReplyModal(false);
            queryClient.invalidateQueries({ queryKey: ["CourseCommentsList"] });
            setValue("Title", "");
            setValue("Describe", "");
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
        addReplyMutate(formData);
      };

      return (
        <div className="column-action d-flex gap-1">
          <Eye
            id={`Eye-${row.id}`}
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setDetailModal(true)}
          />
          <UncontrolledTooltip placement="top" target={`Eye-${row.id}`}>
            جزئیات دیدگاه
          </UncontrolledTooltip>

          <Send
            id={`AddComment-${row.id}`}
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setReplyModal(true)}
          />
          <UncontrolledTooltip placement="top" target={`AddComment-${row.id}`}>
            افزودن دیدگاه
          </UncontrolledTooltip>

          {!row.accept && (
            <Check
              // id={`Approve-${row.commentId}`}
              size={17}
              className="me-50 cursor-pointer"
              onClick={() => acceptCommentMutate(row.commentId)}
            />
          )}
          {/* <UncontrolledTooltip
            placement="top"
            target={`Approve-${row.commentId}`}
          >
            تأیید دیدگاه
          </UncontrolledTooltip> */}
          <Modal
            unmountOnClose
            isOpen={replyModal}
            toggle={() => setReplyModal(!replyModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setReplyModal(!replyModal)}>
              {t("Comments")}
            </ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-5">
              <Row
                tag="form"
                className="gy-1 pt-75"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Col xs={12}>
                  <Label className="form-label" for="Title">
                    {t("CommentTitle")}
                  </Label>
                  <Controller
                    name="Title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="Title"
                        placeholder={t("CommentTitle")}
                        invalid={!!errors.Title}
                      />
                    )}
                  />
                  {errors.Title && (
                    <FormFeedback>{t(errors.Title.message)}</FormFeedback>
                  )}
                </Col>
                <Col xs={12}>
                  <Label className="form-label" for="Describe">
                    {t("CommentDescribe")}
                  </Label>
                  <Controller
                    name="Describe"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="Describe"
                        type="textarea"
                        placeholder={t("CommentDescribe")}
                        invalid={!!errors.Describe}
                        style={{ minHeight: "100px" }}
                      />
                    )}
                  />
                  {errors.Describe && (
                    <FormFeedback>{t(errors.Describe.message)}</FormFeedback>
                  )}
                </Col>
                <Col
                  xs={12}
                  className="text-center d-flex justify-content-between mt-2 pt-50"
                >
                  <Button type="submit" className="me-1" color="primary">
                    {t("SendReply")}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    onClick={() => setReplyModal(!replyModal)}
                  >
                    {t("Cancel")}
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
          <Modal
            unmountOnClose
            isOpen={detailModal}
            toggle={() => setDetailModal(!detailModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setDetailModal(!detailModal)}>
              {t("Comments")}
            </ModalHeader>
            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("CommentTitle")}</Label>
                <span className="text-muted mb-0">{row.commentTitle}</span>
              </div>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("CommentDescribe")}</Label>
                <span className="text-muted mb-0">{row.describe}</span>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                outline
                onClick={() => setDetailModal(false)}
              >
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];
