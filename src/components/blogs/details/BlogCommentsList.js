import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Collapse,
  Spinner,
  Button,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  CornerDownLeft,
} from "react-feather";
import toast from "react-hot-toast";

import { createNewsReplyComment } from "../../../core/services/api/blogs/blogs.service";
import defaultIMG from "../../../assets/images/coursePng.png";
import { useTranslation } from "react-i18next";

const baseURL = import.meta.env.VITE_BASE_URL || "";

const CommentItem = ({
  comment,
  allComments,
  refetchComments,
  isReply = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const replies = allComments?.filter((c) => c.parentId === comment.id) || [];

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);

    const payload = {
      newsId: comment.newsId,
      userIpAddress: "192.168.1.1",
      title: t("BlogAdminReply"),
      describe: replyText,
      userId: 1,
      parentId: comment.id,
    };

    try {
      await createNewsReplyComment(payload);
      toast.success(t("BlogReplySuccess"));
      setReplyText("");
      setIsReplying(false);
      setIsOpen(true);
      if (refetchComments) {
        refetchComments();
      }
    } catch (error) {
      toast.error(t("BlogReplyError"));
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const pictureAddress = comment?.user?.currentPictureAddress;
  let userImg = defaultIMG;
  if (pictureAddress && pictureAddress !== "null" && pictureAddress !== "") {
    userImg = pictureAddress.startsWith("http")
      ? pictureAddress
      : `${baseURL}/${pictureAddress}`;
  }

  return (
    <div
      className={`d-flex align-items-start mb-2 ${
        isReply ? "ms-4 mt-2 " : "border-bottom pb-2"
      }`}
    >
      <img
        src={userImg}
        alt={comment?.userFullName || t("BlogUser")}
        className="rounded-circle me-2 shadow-sm"
        width="45"
        height="45"
        style={{ objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultIMG;
        }}
      />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-50">
          <h6 className="mb-0 fw-bolder text-primary">
            {comment?.userFullName || t("BlogAnonymousUser")}
          </h6>
          <small className="text-muted">
            {comment?.inserDate
              ? new Date(comment.inserDate).toLocaleDateString("fa-IR")
              : "-"}
          </small>
        </div>

        <p className="mb-75">{comment?.describe}</p>

        <div className="d-flex align-items-center">
          <div
            className="d-flex align-items-center text-muted me-2"
            id={`comment-blog-like-${comment?.id}`}
          >
            <ThumbsUp size={14} className="me-50 text-success" />
            <span className="small fw-bolder">{comment?.likeCount || 0}</span>
          </div>
          <UncontrolledTooltip
            placement="top"
            target={`comment-blog-like-${comment?.id}`}
          >
            {t("BlogLikeCount")}
          </UncontrolledTooltip>

          <div
            className="d-flex align-items-center text-muted me-3"
            id={`comment-blog-dislike-${comment?.id}`}
          >
            <ThumbsDown size={14} className="me-50 text-danger" />
            <span className="small fw-bolder">
              {comment?.dissLikeCount || 0}
            </span>
          </div>
          <UncontrolledTooltip
            placement="top"
            target={`comment-blog-dislike-${comment?.id}`}
          >
            {t("BlogDislikeCount")}
          </UncontrolledTooltip>

          <Button
            color="link"
            size="sm"
            className="p-0 text-success d-flex align-items-center text-decoration-none me-2"
            onClick={() => setIsReplying(!isReplying)}
          >
            <CornerDownLeft size={14} className="me-25" />
            <span className="small">{t("BlogReply")}</span>
          </Button>

          {!isReply && replies.length > 0 && (
            <Button
              color="link"
              size="sm"
              className="p-0 text-primary d-flex align-items-center text-decoration-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <MessageCircle size={14} className="me-25" />
              <span className="small me-25">
                {t("BlogReplies")} ({replies.length})
              </span>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          )}
        </div>

        {isReplying && (
          <div className="mt-1 d-flex align-items-start bg-light p-1 rounded border">
            <Input
              type="textarea"
              rows="2"
              placeholder={t("BlogReplyPlaceholder")}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="me-1 flex-grow-1"
              style={{ resize: "none" }}
            />
            <Button
              color="primary"
              size="sm"
              disabled={isSubmittingReply || !replyText.trim()}
              onClick={handleSubmitReply}
            >
              {isSubmittingReply ? <Spinner size="sm" /> : t("BlogSend")}
            </Button>
          </div>
        )}

        {!isReply && (
          <Collapse isOpen={isOpen}>
            <div className="mt-1">
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    allComments={allComments}
                    refetchComments={refetchComments}
                    isReply={true}
                  />
                ))
              ) : (
                <div className="text-muted small mt-1 bg-light p-1 rounded">
                  {t("BlogNoReplies")}
                </div>
              )}
            </div>
          </Collapse>
        )}
      </div>
    </div>
  );
};

const BlogCommentsList = ({ allComments, refetchComments }) => {
  const { t } = useTranslation();
  const mainComments =
    allComments?.filter(
      (c) =>
        !c.parentId ||
        c.parentId === "00000000-0000-0000-0000-000000000000" ||
        c.parentId === "",
    ) || [];

  return (
    <Card>
      <CardHeader className="border-bottom mb-2">
        <CardTitle tag="h4">
          {t("BlogCommentsTitle")} ({mainComments.length})
        </CardTitle>
      </CardHeader>
      <CardBody>
        {mainComments.length > 0 ? (
          mainComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={allComments}
              refetchComments={refetchComments}
            />
          ))
        ) : (
          <div className="text-center text-muted py-5">
            {t("BlogNoComments")}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default BlogCommentsList;
