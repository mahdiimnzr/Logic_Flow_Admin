import { Link } from "react-router-dom";
import Avatar from "@components/avatar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Shield, Eye, MoreVertical, Bell } from "react-feather";
import {
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import formatDate from "../../core/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  addNotifForUser,
  addUserAccess,
  useGetUserList,
} from "../../core/services/api/Users/users.service";
import { useSelector } from "react-redux";
import profile from "/public/Profile.png";
import ImageFallback from "../common/ImageFallback";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object({
  message: Yup.string().trim().required("MessageRequired"),
});

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
  }
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
};

const renderRole = (row) => {
  return (
    <span className="text-truncate text-capitalize align-middle text-primary">
      {row.roles.join(", ")}
    </span>
  );
};

const statusObj = {
  active: "light-success",
  deActive: "light-secondary",
};

export const columns = (t) => [
  {
    name: t("User"),
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
    name: t("Role"),
    sortable: true,
    minWidth: "200px",
    sortField: "role",
    selector: (row) => row.role,
    cell: (row) => renderRole(row),
  },
  {
    name: t("Gmail"),
    minWidth: "300px",
    sortable: true,
    sortField: "gmail",
    selector: (row) => row.gmail,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.gmail}</span>
    ),
  },
  {
    name: t("InsertDate"),
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
    name: t("Status"),
    minWidth: "138px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.active,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row.active ? statusObj.active : statusObj.deActive}
        pill
      >
        {row.active ? t("Active") : t("DeActive")}
      </Badge>
    ),
  },
  {
    name: t("isDelete"),
    minWidth: "80px",
    sortable: true,
    sortField: "isDelete",
    selector: (row) => row.isDelete,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row.isDelete ? statusObj.active : statusObj.deActive}
        pill
      >
        {row.isDelete ? t("Deleted") : t("NotDeleted")}
      </Badge>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "300px",
    cell: (row) => {
      const params = useSelector((state) => state.usersSlice.params);
      const { t } = useTranslation();
      const queryClient = useQueryClient();
      const { data: usersList } = useGetUserList(params);

      const [centeredModal, setCenteredModal] = useState(false);
      const [notificationModal, setNotificationModal] = useState(false);
      const [currentRole, setCurrentRole] = useState({
        value: "",
        label: t("RolesSelection"),
      });
      const [currentAccess, setCurrentAccess] = useState(false);

      const rolesList = usersList?.data?.roles?.map((value) => ({
        value: value.id,
        label: value.name,
      }));

      const roleOptions = [...(rolesList ?? [])];

      const defaultValues = {
        message: "",
        userId: row.id,
      };

      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: accessUserMutate } = useMutation({
        mutationFn: addUserAccess,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            setCenteredModal(false);
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["UsersList"] });
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const { mutate: addNotifForUserMutate } = useMutation({
        mutationFn: addNotifForUser,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          toast.success(response.data.message || t("StatusUpdated"), {
            id: context.toastId,
          });
          queryClient.invalidateQueries({ queryKey: ["UsersList"] });
          setNotificationModal(!notificationModal);
          setValue("message", "");
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        addNotifForUserMutate(data);
      };

      return (
        <div className="column-action d-flex gap-1 align-items-center">
          <Link to={`/Users/Detail/${row.id}`}>
            <Eye
              id={`eyeDetail-${row.id}`}
              size={17}
              className="me-50 cursor-pointer"
            />
          </Link>
          <UncontrolledTooltip placement="top" target={`eyeDetail-${row.id}`}>
            جزئیات کاربر
          </UncontrolledTooltip>
          <Shield
            id={`Access-${row.id}`}
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setCenteredModal(true)}
          />
          <UncontrolledTooltip placement="top" target={`Access-${row.id}`}>
            دسترسی
          </UncontrolledTooltip>
          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <MoreVertical س size={17} className="cursor-pointer" />
            </DropdownToggle>

            <DropdownMenu end>
              <DropdownItem
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  setNotificationModal(!notificationModal);
                }}
              >
                <Bell size={14} className="me-50" />
                <span className="align-middle">{t("SendNotif")}</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Modal
            unmountOnClose
            isOpen={notificationModal}
            toggle={() => setNotificationModal(!notificationModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader
              toggle={() => setNotificationModal(!notificationModal)}
            >
              {t("Notif")}
            </ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-5">
              <Row
                tag="form"
                className="gy-1 pt-75"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Col xs={12}>
                  <Label className="form-label" for="message">
                    {t("NotifMessage")}
                  </Label>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="message"
                        type="textarea"
                        placeholder={t("NotifMessage")}
                        invalid={!!errors.message}
                        style={{ minHeight: "100px" }}
                      />
                    )}
                  />
                  {errors.message && (
                    <FormFeedback>{t(errors.message.message)}</FormFeedback>
                  )}
                </Col>
                <Col
                  xs={12}
                  className="text-center d-flex justify-content-between mt-2 pt-50"
                >
                  <Button type="submit" className="me-1" color="primary">
                    {t("SaveChanges")}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    onClick={() => setNotificationModal(!notificationModal)}
                  >
                    {t("Cancel")}
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
          <Modal
            unmountOnClose
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
                onChange={(data) => setCurrentRole(data)}
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
                  currentRole.value &&
                  accessUserMutate({
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
