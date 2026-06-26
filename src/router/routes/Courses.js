import { lazy } from "react";

const CoursesList = lazy(() => import("../../pages/CoursesList"));
const CoursesDetail = lazy(() => import("../../pages/CoursesDetail"));
const CourseAdd = lazy(() => import("../../pages/CourseAdd"));
const CourseEdit = lazy(() => import("../../pages/CourseEdit"));
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
  {
    path: "/Courses/Edit/:courseId",
    element: <CourseEdit />,
  },
];

export default CoursesRoute;
