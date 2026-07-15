import { lazy } from "react";
import React from "react";

const SessionList = lazy(() => import("../../pages/SessionList"));
const SessionDetails = lazy(() => import("../../pages/SessionDetails"));


const SessionRoute = [
    {
        path: "/session/list",
        element: <SessionList />,
    },
    {
        path: "/session/detail/:id",
        element: <SessionDetails />,
    },
];

export default SessionRoute