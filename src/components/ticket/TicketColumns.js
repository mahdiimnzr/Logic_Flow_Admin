import React from "react";
import { Badge } from "reactstrap";
import { Eye, UserCheck } from "react-feather";
import { Link } from "react-router-dom";

export const getTicketColumns = (handleAcceptTicket) => [
  {
    name: "موضوع تیکت",
    minWidth: "250px",
    selector: (row) => row.problem,
    cell: (row) => <span className="text-truncate font-weight-bold">{row.problem}</span>,
  },
  {
    name: "وضعیت",
    minWidth: "120px",
    selector: (row) => row.isDone,
    cell: (row) => {
      return row.isDone ? (
        <Badge color="light-secondary" className="px-2 py-50" pill>بسته شده</Badge>
      ) : row.supporterId ? (
        <Badge color="light-success" className="px-2 py-50" pill>در حال بررسی</Badge>
      ) : (
        <Badge color="light-warning" className="px-2 py-50" pill>در انتظار پشتیبان</Badge>
      );
    },
  },
  {
    name: "تاریخ بروزرسانی",
    minWidth: "150px",
    selector: (row) => row.updateDate,
    cell: (row) => <span>{row.updateDate ? row.updateDate.substring(0, 10) : "---"}</span>,
  },
  {
    name: "عملیات",
    minWidth: "100px",
    cell: (row) => (
      <div className="d-flex align-items-center gap-1">
        <Link to={`/TicketDetail/${row.id}`} className="text-body" title="مشاهده">
          <Eye size={18} />
        </Link>
        {!row.supporterId && !row.isDone && (
          <span 
            className="text-body cursor-pointer" 
            title="پذیرش تیکت"
            onClick={() => handleAcceptTicket(row.id)}
          >
            <UserCheck size={18} />
          </span>
        )}
      </div>
    ),
  },
];