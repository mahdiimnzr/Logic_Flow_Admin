import { lazy } from "react";

const Users = lazy(() => import("../../pages/Users"));

const UsersRoute = [
  {
    path: "/Users",
    element: <Users />,
  },
];

export default UsersRoute