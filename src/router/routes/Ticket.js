import { lazy } from "react";
import React from "react";

const AllTickets = lazy(() => import("../../pages/AllTickets"));

const ticketRoute = [
    {
        path:"/allTickets",
        element:<AllTickets />
    },
]

export default ticketRoute