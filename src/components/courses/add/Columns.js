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
// import formatDate from "../../core/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
// import {
//   addUserAccess,
//   useGetUserList,
// } from "../../core/services/api/Users/users.service";
import { useSelector } from "react-redux";

const statusObj = {
  active: "light-success",
  deActive: "light-secondary",
};

export const columns = [
  {
    name: "ID",
    sortable: true,
    minWidth: "200px",
    sortField: "id",
    selector: (row) => row.courseId,
    cell: (row) => (
      <div className="d-flex flex-column">
        <Link
          to={`/Courses/Detail/${row.courseId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{row.courseId} </span>
        </Link>
      </div>
    ),
  },
  {
    name: "Sign ID",
    sortable: true,
    minWidth: "200px",
    sortField: "id",
    selector: (row) => row.id,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">{row.id} </span>
      </div>
    ),
  },
  {
    name: "course Group ID",
    sortable: true,
    minWidth: "200px",
    sortField: "id",
    selector: (row) => row.courseGroupId,
    cell: (row) => (
      <div className="d-flex flex-column">
        <span className="fw-bolder">{row.courseGroupId} </span>
      </div>
    ),
  },
  {
    name: "Student ID",
    sortable: true,
    minWidth: "200px",
    sortField: "id",
    selector: (row) => row.studentId,
    cell: (row) => (
      <div className="d-flex flex-column">
        <Link
          to={`/Users/Detail/${row.studentId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{row.studentId} </span>
        </Link>
      </div>
    ),
  },
];
