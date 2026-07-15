import { Badge } from "reactstrap";
import { Eye, Edit, Trash } from "react-feather";
import { Link } from "react-router-dom";

export const SessionColumns = [
  {
    name: "عنوان جلسه",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.title,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <Link
            to={`/session/detail/${row.id}`}
            className="user_name text-truncate text-body"
          >
            <span className="fw-bolder">{row.title}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">{row.courseName}</small>
        </div>
      </div>
    ),
  },
  {
    name: "تاریخ برگزاری",
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.date,
  },
  {
    name: "وضعیت",
    minWidth: "120px",
    cell: (row) => (
      <Badge color={row.isActive ? "light-success" : "light-secondary"} pill>
        {row.isActive ? "فعال" : "غیرفعال"}
      </Badge>
    ),
  },
  {
    name: "عملیات",
    minWidth: "150px",
    cell: (row) => (
      <div className="column-action d-flex align-items-center">
        <Link to={`/session/detail/${row.id}`} className="text-body" id={`view-tooltip-${row.id}`}>
          <Eye size={17} className="mx-1" />
        </Link>
        <Link to="#" className="text-body" id={`edit-tooltip-${row.id}`}>
          <Edit size={17} className="mx-1" />
        </Link>
        <Link to="#" className="text-danger" id={`delete-tooltip-${row.id}`}>
          <Trash size={17} className="mx-1" />
        </Link>
      </div>
    ),
  },
];