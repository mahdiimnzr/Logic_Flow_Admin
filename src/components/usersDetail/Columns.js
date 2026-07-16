import { Link } from "react-router-dom";
import { Eye } from "react-feather";
import { useTranslation } from "react-i18next";
import formatPrice from "../../core/utils/formatPrice";
import ImageFallback from "../common/ImageFallback";
import courseImage from "../../assets/images/coursePng.png";

export const columns = (t) => [
  {
    name: t("CourseTitle"),
    sortable: true,
    minWidth: "300px",
    sortField: "title",
    selector: (row) => row.title,
    cell: (row) => (
      <div className="d-flex align-items-center gap-1 text-truncate">
        <ImageFallback
          className="me-1"
          style={{ borderRadius: "100%", width: "32px", height: "32px" }}
          fallback={courseImage}
          src={row.imageAddress}
        />

        <Link
          to={`/Courses/Detail/${row.courseId}`}
          className="user_name text-body text-truncate"
        >
          <span className="fw-bolder text-truncate">{row.title}</span>
        </Link>
      </div>
    ),
  },
  {
    name: t("Teacher"),
    sortable: true,
    minWidth: "200px",
    sortField: "teacher",
    selector: (row) => row.teacherName,
    cell: (row) => (
      <div className="d-flex flex-column">
        <Link
          to={`/Users/Detail/${row.teacherId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{row.teacherName}</span>
        </Link>
      </div>
    ),
  },
  {
    name: t("CourseCost"),
    sortable: true,
    minWidth: "200px",
    sortField: "cost",
    selector: (row) => row.cost,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">
          {formatPrice(row.cost)} {t("Toman")}
        </span>
      </div>
    ),
  },
  {
    name: t("CourseCapacity"),
    sortable: true,
    minWidth: "200px",
    sortField: "capacity",
    selector: (row) => row.capacity,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">{formatPrice(row.capacity)}</span>
      </div>
    ),
  },
  {
    name: t("CourseStatus"),
    sortable: true,
    minWidth: "200px",
    sortField: "courseStatusName",
    selector: (row) => row.courseStatusName,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">{row.courseStatusName}</span>
      </div>
    ),
  },
  {
    name: t("Actions"),
    sortable: true,
    minWidth: "20px",
    sortField: "capacity",
    selector: (row) => row.capacity,
    cell: (row) => (
      <div className="d-flex flex-column">
        <Link
          to={`/Courses/Detail/${row?.courseId}`}
          id={`pw-tooltip-${row?.courseId}`}
        >
          <Eye size={17} className="mx-1" />
        </Link>
      </div>
    ),
  },
];
