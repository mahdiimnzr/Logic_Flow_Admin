import { lazy } from "react";
import React from "react";

const AllTickets = lazy(() => import("../../pages/AllTickets"));
const AdminTicketDetail = lazy(() => import("../../pages/AdminTicketDetail"));

const ticketRoute = [
    {
        path: "/allTickets",
        element: <AllTickets />
    },
    {
        path: "/TicketDetail/:id",
        element: <AdminTicketDetail />
    },
]

export default ticketRoute