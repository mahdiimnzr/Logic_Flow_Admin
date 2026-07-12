import { Link } from "react-router-dom";
import { Eye, Check } from "react-feather";
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
import { acceptCourseComment } from "../../core/services/api/Comments/comments.service";

const statusObj = {
  active: "light-success",
  deActive: "light-secondary",
};

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

      return (
        <div className="column-action d-flex gap-1">
          <Eye
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setDetailModal(true)}
          />

          {!row.accept && (
            <Check
              size={17}
              className="me-50 cursor-pointer"
              onClick={() => acceptCommentMutate(row.commentId)}
            />
          )}

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
              <Button color="secondary" outline onClick={() => setDetailModal(false)}>
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];