import { lazy } from "react";

const Login = lazy(() => import("../../pages/Login"));

const AuthRoute = [
  {
    path: "/Auth/Login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
];

export default AuthRoute;
