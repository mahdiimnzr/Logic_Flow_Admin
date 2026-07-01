import { Link } from "react-router-dom";
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
import { acceptCourseComment } from "../../../../core/services/api/Comments/comments.service";

const statusObj = {
  active: "light-success",
  deActive: "light-secondary",
};

export const columns = [
  {
    name: "Writer",
    minWidth: "50px",
    maxWidth: "250px",
    sortable: true,
    sortField: "writer",
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
    name: "Title",
    minWidth: "80px",
    maxWidth: "200px",
    sortable: true,
    sortField: "title",
    selector: (row) => row.commentTitle,
    cell: (row) => (
      <span className="fw-bolder text-truncate">{row.commentTitle}</span>
    ),
  },
  {
    name: "Describe",
    minWidth: "200px",
    maxWidth: "300px",
    sortable: true,
    sortField: "title",
    selector: (row) => row.describe,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.describe}</span>
    ),
  },
  {
    name: "Status",
    minWidth: "50px",
    maxWidth: "130px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.active,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <Badge
          className="text-capitalize"
          color={row.accept ? statusObj.active : statusObj.deActive}
          pill
        >
          {row.accept ? t("Accept") : t("NotAccept")}
        </Badge>
      );
    },
  },
  {
    name: "Actions",
    minWidth: "150px",
    maxWidth: "200px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();
      const [centeredModal, setCenteredModal] = useState(false);

      const { mutate: acceptCommentMutate } = useMutation({
        mutationFn: acceptCourseComment,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({
              queryKey: [`CourseCommentsList`],
            });
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (response, _, context) => {
          toast.error(response.data.message, { id: context.toastId });
        },
      });

      return (
        <div className="column-action d-flex gap-1">
          <Button.Ripple
            onClick={() => setCenteredModal(!centeredModal)}
            color="info"
            size="sm"
          >
            {t("Detail")}
          </Button.Ripple>
          {!row.accept && (
            <Button.Ripple
              onClick={() => acceptCommentMutate(row.commentId)}
              color="warning"
              size="sm"
            >
              {t("AcceptComment")}
            </Button.Ripple>
          )}
          <Modal
            unmountOnClose={true}
            isOpen={centeredModal}
            toggle={() => setCenteredModal(!centeredModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
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
                color="primary"
                onClick={() => setCenteredModal(!centeredModal)}
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
