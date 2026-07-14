import { lazy } from "react";

const AdminSchedule = lazy(() => import("../../pages/AdminSchedule"));

const Schedule = [
  {
    path: "/Schedule/Admin",
    element: <AdminSchedule />,
  },
];

export default Schedule;
