import { lazy } from "react";

const Dashboard = lazy(() => import("../../pages/Dashboard"));

const DashboardRoute = [
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
];

export default DashboardRoute