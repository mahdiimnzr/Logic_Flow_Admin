import { lazy } from "react";

const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"));

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
