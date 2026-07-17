import React from "react";
import { Edit } from "react-feather";
import { UncontrolledTooltip } from "reactstrap";

export const getCategoryColumns = (onEditClick) => [
  {
    name: "نام دسته‌بندی",
    sortable: true,
    minWidth: "250px",
    selector: (row) => row.categoryName,
    cell: (row) => (
      <span className="fw-bolder text-primary">{row.categoryName}</span>
    ),
  },
  {
    name: "عنوان گوگل (SEO)",
    sortable: true,
    minWidth: "300px",
    selector: (row) => row.googleTitle,
    cell: (row) => <span>{row.googleTitle || "-"}</span>,
  },
  {
    name: "عملیات",
    minWidth: "100px",
    cell: (row) => (
      <>
        <Edit
          id={`EyeStatus-${row.id}`}
          size={17}
          className="me-50 cursor-pointer"
          onClick={() => onEditClick(row)}
        />
        <UncontrolledTooltip placement="top" target={`EyeStatus-${row.id}`}>
          ویرایش دسته‌بندی
        </UncontrolledTooltip>
      </>
    ),
  },
];
