import { lazy } from "react";

const TechnologyManagement = lazy(() =>
  import("../../pages/TechnologyManagement"),
);

const ManagementCoursesRoute = [
  {
    path: "ManagementCourses/TechnologyManagement",
    element: <TechnologyManagement />,
  },
];

export default ManagementCoursesRoute;
