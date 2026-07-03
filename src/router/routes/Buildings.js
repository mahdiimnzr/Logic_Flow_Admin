import { lazy } from "react";

const Buildings = lazy(() => import("../../pages/Buildings"));

const BuildingRoute = [
  {
    path: "/Buildings/List",
    element: <Buildings />,
  },
];

export default BuildingRoute;
