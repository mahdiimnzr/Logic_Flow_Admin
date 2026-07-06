import { lazy } from "react";

const CoursesList = lazy(() => import("../../pages/CoursesList"));
const CoursesDetail = lazy(() => import("../../pages/CoursesDetail"));
const CourseAdd = lazy(() => import("../../pages/CourseAdd"));
const CourseEdit = lazy(() => import("../../pages/CourseEdit"));
const TechnologyManagement = lazy(() =>
  import("../../pages/TechnologyManagement"),
);
const LevelManagement = lazy(() => import("../../pages/LevelManagement"));
const StatusManagement = lazy(() => import("../../pages/StatusManagement"));
const DepartmentsManagement = lazy(() =>
  import("../../pages/DepartmentsManagement"),
);
const ClassRoomsManagement = lazy(() =>
  import("../../pages/ClassRoomsManagement"),
);
const Terms = lazy(() => import("../../pages/Terms"));
const ManagementCoursesRoute = [
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
  {
    path: "ManagementCourses/TechnologyManagement",
    element: <TechnologyManagement />,
  },
  {
    path: "ManagementCourses/LevelManagement",
    element: <LevelManagement />,
  },
  {
    path: "ManagementCourses/StatusManagement",
    element: <StatusManagement />,
  },
  {
    path: "ManagementCourses/DepartmentsManagement",
    element: <DepartmentsManagement />,
  },
  {
    path: "ManagementCourses/ClassRoomsManagement",
    element: <ClassRoomsManagement />,
  },
  {
    path: "ManagementCourses/TermsList",
    element: <Terms />,
  },
];

export default ManagementCoursesRoute;
