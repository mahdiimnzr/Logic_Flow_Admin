import { lazy } from "react";

const Dashboard = lazy(() => import("../../pages/Dashboard"));

const DashboardRoute = [
    {
        path: "/Dashboard",
        element: <Dashboard />,
    },
];

export default DashboardRoute