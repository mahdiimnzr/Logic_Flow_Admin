import postParams from "../../common/postParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetCourseCommentsList = (params) =>
  useGetQuery(
    "CourseCommentsList",
    "Course/CommentManagment",
    params,
    null,
    false,
  );
export const acceptCourseComment = (params) =>
  postParams(`Course/AcceptCourseComment?CommentCourseId=${params}`);
export const addReplyComment = (body) =>
  postParams("Course/AddReplyCourseComment", body);
