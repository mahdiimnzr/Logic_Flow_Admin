import React from "react";
import { Badge, UncontrolledTooltip } from "reactstrap";
import { Eye, UserCheck } from "react-feather";
import { Link } from "react-router-dom";
import formatDate from "../../core/utils/formatDate";

export const getTicketColumns = (handleAcceptTicket, t) => [
  {
    name: t("TicketTitles"),
    minWidth: "250px",
    selector: (row) => row.problem,
    cell: (row) => (
      <span className="text-truncate font-weight-bold">{row.problem}</span>
    ),
  },
  {
    name: t("Status"),
    minWidth: "120px",
    selector: (row) => row.isDone,
    cell: (row) => {
      return row.isDone ? (
        <Badge color="light-secondary" className="px-2 py-50" pill>
          {t("Closed")}
        </Badge>
      ) : row.supporterId ? (
        <Badge color="light-success" className="px-2 py-50" pill>
          {t("IsChecking")}
        </Badge>
      ) : (
        <Badge color="light-warning" className="px-2 py-50" pill>
          {t("SupporterPending")}
        </Badge>
      );
    },
  },
  {
    name: t("UpdateDate"),
    minWidth: "150px",
    selector: (row) => row.updateDate,
    cell: (row) => (
      <span>{row.updateDate ? formatDate(row.updateDate) : "---"}</span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "100px",
    cell: (row) => (
      <div className="d-flex align-items-center gap-1">
        <Link to={`/TicketDetail/${row.id}`} className="text-body">
          <Eye id={`ticket-${row.id}`} size={18} />
          <UncontrolledTooltip placement="top" target={`ticket-${row.id}`}>
            {t("TicketDetail")}
          </UncontrolledTooltip>
        </Link>
        {!row.supporterId && !row.isDone && (
          <span
            id={`ticket-accept-${row.id}`}
            className="text-body cursor-pointer"
            onClick={() => handleAcceptTicket(row.id)}
          >
            <UserCheck size={18} />
            <UncontrolledTooltip
              placement="top"
              target={`ticket-accept-${row.id}`}
            >
              {t("AcceptTicket")}
            </UncontrolledTooltip>
          </span>
        )}
      </div>
    ),
  },
];
