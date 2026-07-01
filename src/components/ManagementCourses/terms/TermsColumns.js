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

import { useSelector } from "react-redux";
import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";

// ** Renders Client Columns
const renderClient = (row) => {
  if (row?.currentPictureAddress) {
    return (
      <ImageFallback
        className="me-1"
        style={{ borderRadius: "100%", width: "32px", height: "32px" }}
        src={row?.currentPictureAddress}
        fallback={profile}
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
            to={`/Users/Detail/${row.id}`}
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
        {/* {formatDate(row.insertDate)} */}
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
    minWidth: "80px",
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
    minWidth: "300px",
    cell: (row) => {
      const params = useSelector((state) => state.usersSlice.params);
      const { t } = useTranslation();
      const navigate = useNavigate();
      const queryClient = useQueryClient();
      // const { data: usersList } = useGetUserList(params);
      const [centeredModal, setCenteredModal] = useState(false);
      const [currentRole, setCurrentRole] = useState({
        value: "",
        label: t("RolesSelection"),
      });
      const [currentAccess, setCurrentAccess] = useState(false);
      // ** User filter options
      const rolesList = usersList?.data?.roles?.map((value) => {
        const roles = { value: value.id, label: value.name };
        return roles;
      });
      const roleOptions = [...(rolesList ?? [])];
      // ** Handle Submit
      // const { mutate: accessUserMutate } = useMutation({
      //   mutationFn: addUserAccess,
      //   onMutate: () => {
      //     const toastId = toast.loading(t("Loading"));
      //     return { toastId };
      //   },
      //   onSuccess: (response, _, context) => {
      //     if (response.data.success) {
      //       setCenteredModal(!centeredModal);
      //       toast.success(response.data.message, { id: context.toastId });
      //       queryClient.invalidateQueries({
      //         queryKey: [`UsersList`],
      //       });
      //     } else {
      //       toast.error(response.data.message, { id: context.toastId });
      //     }
      //   },
      //   onError: (response, _, context) => {
      //     toast.error(response.data.message, { id: context.toastId });
      //   },
      // });
      return (
        <div className="column-action d-flex gap-1">
          <Button.Ripple
            onClick={() => navigate(`/Users/Detail/${row.id}`)}
            color="info"
            size="sm"
          >
            {t("Detail")}
          </Button.Ripple>
          <Button.Ripple
            onClick={() => setCenteredModal(!centeredModal)}
            color="warning"
            size="sm"
          >
            {t("Access")}
          </Button.Ripple>
          <Modal
            unmountOnClose={true}
            isOpen={centeredModal}
            toggle={() => setCenteredModal(!centeredModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
              {t("Access")}
            </ModalHeader>
            <ModalBody>
              <Label for="role-select">{t("Roles")}</Label>
              <Select
                isClearable={false}
                value={currentRole}
                options={roleOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentRole(data);
                }}
              />
              <div className="form-check form-switch mt-2">
                <Input
                  type="switch"
                  name="access"
                  id="access"
                  onChange={(event) => setCurrentAccess(event.target.checked)}
                />
                <Label for="access" className="form-check-label">
                  {t("RemoveAccess")} / {t("AddAccess")}
                </Label>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  currentRole.value == ""
                    ? null
                    : accessUserMutate({
                        currentAccess,
                        body: { roleId: currentRole.value, userId: row.id },
                      })
                }
              >
                {t("SaveChanges")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];
