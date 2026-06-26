import { lazy } from "react";

const CoursesList = lazy(() => import("../../pages/CoursesList"));
const CoursesDetail = lazy(() => import("../../pages/CoursesDetail"));
const CoursesRoute = [
  {
    path: "/Courses/List",
    element: <CoursesList />,
  },
  {
    path: "/Courses/Detail/:courseId",
    element: <CoursesDetail />,
  },
];

export default CoursesRoute;
