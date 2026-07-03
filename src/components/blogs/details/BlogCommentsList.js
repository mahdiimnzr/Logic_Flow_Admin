import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody, Badge, Collapse, Spinner, Button } from 'reactstrap';
import { ThumbsUp, ThumbsDown, MessageCircle, ChevronDown, ChevronUp } from 'react-feather';


import { getRepliesComments } from '../../../core/services/api/blogs/blogs.service';
import defaultIMG from "../../../assets/images/coursePng.png";

const baseURL = import.meta.env.VITE_BASE_URL || "";

const CommentItem = ({ comment, isReply = false }) => {

    const [isOpen, setIsOpen] = useState(false);

    const [replies, setReplies] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleToggleReplies = async () => {

        if (!isOpen && replies.length === 0) {

            setIsLoading(true);

            try {
                const data = await getRepliesComments(comment.id);
                setReplies(data || []);

            } catch (error) {
                console.error("خطا در دریافت پاسخ‌ها:", error);
            } finally {
                setIsLoading(false);
            }
        }
        setIsOpen(!isOpen);
    };

    const pictureAddress = comment?.user?.currentPictureAddress;
    let userImg = defaultIMG;
    if (pictureAddress && pictureAddress !== "null" && pictureAddress !== "") {
        userImg = pictureAddress.startsWith('http') ? pictureAddress : `${baseURL}/${pictureAddress}`;
    }

    return (
        <div className={`d-flex align-items-start mb-2 ${isReply ? 'ms-3 mt-2 border-start ps-2 border-2 border-primary' : 'border-bottom pb-2'}`}>
            <img
                src={userImg}
                alt={comment?.userFullName || 'کاربر'}
                className="rounded-circle me-2 shadow-sm"
                width="45"
                height="45"
                style={{ objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = defaultIMG; }}
            />
            <div className="flex-grow-1">

                <div className="d-flex justify-content-between align-items-center mb-50">
                    <h6 className="mb-0 fw-bolder text-primary">
                        {comment?.userFullName || 'کاربر ناشناس'}
                    </h6>
                    <small className="text-muted">
                        {comment?.inserDate ? new Date(comment.inserDate).toLocaleDateString('fa-IR') : '-'}
                    </small>
                </div>

                <p className="mb-75">{comment?.describe}</p>

                <div className="d-flex align-items-center">

                    <div className="d-flex align-items-center text-muted me-2" title="تعداد لایک کاربران">
                        <ThumbsUp size={14} className="me-50 text-success" />
                        <span className="small fw-bolder">{comment?.likeCount || 0}</span>
                    </div>

                    <div className="d-flex align-items-center text-muted me-3" title="تعداد دیس‌لایک کاربران">
                        <ThumbsDown size={14} className="me-50 text-danger" />
                        <span className="small fw-bolder">{comment?.dissLikeCount || 0}</span>
                    </div>

                    {!isReply && (
                        <Button color="link" size="sm" className="p-0 text-primary d-flex align-items-center text-decoration-none" onClick={handleToggleReplies}>
                            <MessageCircle size={14} className="me-25" />
                            <span className="me-25">پاسخ‌ها</span>
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                    )}
                </div>

                {!isReply && (
                    <Collapse isOpen={isOpen}>
                        <div className="mt-1">
                            {isLoading ? (
                                <div className="text-center my-1"><Spinner size="sm" color="primary" /></div>
                            ) : replies.length > 0 ? (
                                replies.map(reply => (
                                    <CommentItem key={reply.id} comment={reply} isReply={true} />
                                ))
                            ) : (
                                <div className="text-muted small mt-1 bg-light p-1 rounded">هیچ پاسخی برای این نظر ثبت نشده است.</div>
                            )}
                        </div>
                    </Collapse>
                )}
            </div>
        </div>
    );
};

const BlogCommentsList = ({ comments }) => {

    const mainComments = comments?.filter(c => !c.parentId || c.parentId === "00000000-0000-0000-0000-000000000000" || c.parentId === "") || [];

    return (
        <Card>
            <CardHeader className="border-bottom mb-2">
                <CardTitle tag="h4">نظرات کاربران ({mainComments.length})</CardTitle>
            </CardHeader>
            <CardBody>
                {mainComments.length > 0 ? (
                    mainComments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                ) : (
                    <div className="text-center text-muted py-5">
                        هیچ نظری برای این مقاله یافت نشد.
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default BlogCommentsList;