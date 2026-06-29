// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Icons Imports
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive,
  Eye,
} from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import formatDate from "../../core/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  addUserAccess,
  useGetUserList,
} from "../../core/services/api/Users/users.service";
import { useSelector } from "react-redux";
import formatPrice from "../../core/utils/formatPrice";
import { t } from "i18next";
import ImageFallback from "../common/ImageFallback";
import courseImage from "../../assets/images/coursePng.png";

const statusObj = {
  active: "light-success",
  deActive: "light-secondary",
};

export const columns = [
  {
    name: "Course Title",
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
          <span className="fw-bolder text-truncate">{row.title} </span>
        </Link>
      </div>
    ),
  },
  {
    name: "Teacher",
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
          <span className="fw-bolder">{row.teacherName} </span>
        </Link>
      </div>
    ),
  },
  {
    name: "course Cost",
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
    name: "Course Capacity",
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
    name: "Course Status",
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
    name: "Actions",
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
