// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
// import { store } from "@store/store";
// import { getUser, deleteUser } from "../store";

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
} from "reactstrap";
import { useTranslation } from "react-i18next";
import formatDate from "../../core/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ** Renders Client Columns
const renderClient = (row) => {
  if (row.currentPictureAddress) {
    return (
      <Avatar
        className="me-1"
        img={row.currentPictureAddress}
        width="32"
        height="32"
      />
    );
  } else {
    return (
      <Avatar
        initials
        className="me-1"
        color={row.avatarColor || "light-primary"}
        content={
          row?.fName?.toUpperCase() + row?.lName?.toUpperCase() || "Unknown"
        }
      />
    );
  }
};

// ** Renders Role Columns
const renderRole = (row) => {
  return (
    <span className={`text-truncate text-capitalize align-middle text-primary`}>
      {row.roles.join(", ")}
    </span>
  );
};

const statusObj = {
  active: "light-success",
  deActive: "light-secondary",
};

export const columns = [
  {
    name: "User",
    sortable: true,
    minWidth: "200px",
    sortField: "fullName",
    selector: (row) => row.fullName,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/apps/user/view/${row.id}`}
            className="user_name text-truncate text-body"
            // onClick={() => store.dispatch(getUser(row.id))}
          >
            <span className="fw-bolder">
              {row.fName} {row.lName}
            </span>
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: "Role",
    sortable: true,
    minWidth: "200px",
    sortField: "role",
    selector: (row) => row.role,
    cell: (row) => renderRole(row),
  },
  {
    name: "Gmail",
    minWidth: "300px",
    sortable: true,
    sortField: "gmail",
    selector: (row) => row.gmail,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.gmail}</span>
    ),
  },
  {
    name: "Insert Date",
    minWidth: "80px",
    sortable: true,
    sortField: "insertDate",
    selector: (row) => row.insertDate,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {formatDate(row.insertDate)}
      </span>
    ),
  },
  {
    name: "Status",
    minWidth: "138px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.active,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <Badge
          className="text-capitalize"
          color={row.active ? statusObj.active : statusObj.deActive}
          pill
        >
          {row.active ? t("Active") : t("DeActive")}
        </Badge>
      );
    },
  },
  {
    name: "isDelete",
    minWidth: "138px",
    sortable: true,
    sortField: "isDelete",
    selector: (row) => row.isDelete,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <Badge
          className="text-capitalize"
          color={row.isDelete ? statusObj.active : statusObj.deActive}
          pill
        >
          {row.isDelete ? t("Deleted") : t("NotDeleted")}
        </Badge>
      );
    },
  },
  {
    name: "Actions",
    minWidth: "100px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();
      // const { mutate: deleteUserMutate } = useMutation({
      //   mutationFn: deleteUser,
      //   onSuccess: (response) => {
      //     if (response.data.success) {
      //       toast.success(response.data.message);
      //       queryClient.invalidateQueries({ queryKey: ["UsersList"] });
      //     } else if (!response.data.success) {
      //       toast.error(response.data.message);
      //     }
      //   },
      //   onError: (response) => {
      //     toast.error(response.data.message);
      //   },
      // });
      return (
        <div className="column-action d-flex">
          <Button.Ripple
            color="danger"
            size="sm"
            // onClick={() => {
            //   deleteUserMutate({
            //     userId: row.id,
            //   });
            // }}
          >
            {t("isDelete")}
          </Button.Ripple>
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                tag={Link}
                className="w-100"
                to={`/apps/user/view/${row.id}`}
                //   onClick={() => store.dispatch(getUser(row.id))}
              >
                <FileText size={14} className="me-50" />
                <span className="align-middle">Details</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    },
  },
];
