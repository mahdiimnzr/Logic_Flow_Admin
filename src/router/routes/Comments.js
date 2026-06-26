import { lazy } from "react";

const Comments = lazy(() => import("../../pages/Comments"));

const CommentsRoute = [
  {
    path: "/Comments/List",
    element: <Comments />,
  },
];

export default CommentsRoute;
