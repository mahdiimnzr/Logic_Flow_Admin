import { lazy } from "react";

const CoursesList = lazy(() => import("../../pages/CoursesList"));
const CoursesDetail = lazy(() => import("../../pages/CoursesDetail"));
const CourseEdit = lazy(() => import("../../pages/CourseEdit"));
const CoursesRoute = [
  {
    path: "/Courses/List",
    element: <CoursesList />,
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
