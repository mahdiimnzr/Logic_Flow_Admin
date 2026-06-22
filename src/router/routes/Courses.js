import { lazy } from "react";

const CoursesList = lazy(() => import("../../pages/CoursesList"));

const CoursesRoute = [
  {
    path: "/Courses/List",
    element: <CoursesList />,
  },
  {},
];

export default CoursesRoute;
