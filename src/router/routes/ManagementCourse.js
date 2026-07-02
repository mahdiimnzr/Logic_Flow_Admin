import { lazy } from "react";

const TechnologyManagement = lazy(() =>
  import("../../pages/TechnologyManagement"),
);
const LevelManagement = lazy(() => import("../../pages/LevelManagement"));
const StatusManagement = lazy(() => import("../../pages/StatusManagement"));
const DepartmentsManagement = lazy(() =>
  import("../../pages/DepartmentsManagement"),
);
const Terms = lazy(() => import("../../pages/Terms"));
const ManagementCoursesRoute = [
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
    path: "ManagementCourses/TermsList",
    element: <Terms />,
  },
];

export default ManagementCoursesRoute;
