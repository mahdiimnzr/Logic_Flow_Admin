import { lazy } from "react";

const CoursesList = lazy(() => import("../../pages/CoursesList"));
const CoursesDetail = lazy(() => import("../../pages/CoursesDetail"));
const CourseAdd = lazy(() => import("../../pages/CourseAdd"));
const CoursesRoute = [
  {
    path: "/Courses/List",
    element: <CoursesList />,
  },
  {
    path: "/Courses/add",
    element: <CourseAdd />,
  },
  {
    path: "/Courses/Detail/:courseId",
    element: <CoursesDetail />,
  },
];

export default CoursesRoute;
