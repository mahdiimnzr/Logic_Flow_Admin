import { lazy } from "react";

const Users = lazy(() => import("../../pages/Users"));
const UsersDetail = lazy(() => import("../../pages/UsersDetail"));

const UsersRoute = [
  {
    path: "/Users/List",
    element: <Users />,
  },
  {
    path: "/Users/Detail/:userId",
    element: <UsersDetail />,
  },
];

export default UsersRoute;
