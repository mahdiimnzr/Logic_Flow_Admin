import postParams from "../../common/postParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetCourseCommentsList = (params) =>
  useGetQuery("CourseCommentsList", "Course/CommentManagment", params);
export const acceptCourseComment = (params) =>
  postParams(`Course/AcceptCourseComment?CommentCourseId=${params}`);
