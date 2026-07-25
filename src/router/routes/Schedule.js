import { lazy } from "react";

const AdminSchedule = lazy(() => import("../../pages/AdminSchedule"));
const TeacherSchedule = lazy(() => import("../../pages/TeacherSchedule"));
const StudentSchedule = lazy(() => import("../../pages/StudentSchedule"));

const Schedule = [
  {
    path: "/Schedule/Admin",
    element: <AdminSchedule />,
  },
  {
    path: "/Schedule/Teacher",
    element: <TeacherSchedule />,
  },
  {
    path: "/Schedule/Student",
    element: <StudentSchedule />,
  },
];

export default Schedule;
