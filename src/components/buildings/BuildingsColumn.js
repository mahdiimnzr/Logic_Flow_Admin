import { useForm } from "react-hook-form";
import { Edit, Eye, MoreVertical, TrendingUp } from "react-feather";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { activeBuildings } from "../../core/services/api/buildings/buildings.service";
import EditBuildingsModal from "./EditBuildingsModal";

export const columns = (t) => [
  {
    name: t("Building"),
    minWidth: "80px",
    sortable: true,
    sortField: "buildingName",
    selector: (row) => row.buildingName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {row.buildingName + " ( " + t("Floor") + ": " + row.floor + " )"}
      </span>
    ),
  },
  {
    name: t("BuildingAddress"),
    minWidth: "80px",
    sortable: true,
    sortField: "buildingAddress",
    selector: (row) => row.buildingAddress,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {row.buildingAddress}
      </span>
    ),
  },
  {
    sortable: true,
    name: t("Status"),
    minWidth: "164px",
    sortField: "active",
    selector: (row) => row?.active,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row?.active ? "light-success" : "light-danger"}
        pill
      >
        {row?.active ? t("Active") : t("DeActive")}
      </Badge>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "50px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();

      const [editModal, setEditModal] = useState(false);
      const [detailModal, setDetailModal] = useState(false);

      const { mutate: activeBuildingMutate } = useMutation({
        mutationFn: activeBuildings,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          toast.success(response.data.message, { id: context.toastId });
          queryClient.invalidateQueries({
            queryKey: ["Buildings"],
          });
        },
        onError: (error, _, context) => {
          toast.error(error?.response?.data?.message || t("ErrorOccurred"), {
            id: context.toastId,
          });
        },
      });

      const toggleDetailModal = () => setDetailModal(!detailModal);
      const toggleEditModal = () => setEditModal(!editModal);

      return (
        <div className="column-action d-flex gap-1 align-items-center">
          <Eye
            size={17}
            className="me-50 cursor-pointer"
            onClick={toggleDetailModal}
          />

          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <MoreVertical size={17} className="cursor-pointer" />
            </DropdownToggle>

            <DropdownMenu end>
              <DropdownItem
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  activeBuildingMutate({
                    active: !row.active,
                    id: row.id,
                  });
                }}
              >
                <TrendingUp size={14} className="me-50" />
                <span className="align-middle">
                  {row.active ? t("DeActive") : t("Active")}
                </span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <Modal
            unmountOnClose
            isOpen={detailModal}
            toggle={toggleDetailModal}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={toggleDetailModal}>
              {t("Building")}
            </ModalHeader>

            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("BuildingName")}</Label>
                <span className="text-muted mb-0">{row.buildingName}</span>
              </div>

              <div className="mb-1 d-flex flex-column">
                <Label>{t("Floor")}</Label>
                <span className="text-muted mb-0">{row.floor}</span>
              </div>

              <div className="mb-1 d-flex flex-column">
                <Label>{t("BuildingAddress")}</Label>
                <span className="text-muted mb-0">{row.buildingAddress}</span>
              </div>
              <div
                style={{ width: "fit-content" }}
                className="mb-1 d-flex flex-column"
              >
                <Label>{t("Status")}</Label>
                <Badge
                  className="text-capitalize"
                  color={row?.active ? "light-success" : "light-danger"}
                  pill
                >
                  {row?.active ? t("Active") : t("DeActive")}
                </Badge>
              </div>
            </ModalBody>

            <ModalFooter className="d-flex justify-content-between">
              <Button
                color="primary"
                onClick={() => {
                  toggleDetailModal();
                  toggleEditModal();
                }}
              >
                {t("Edit")}
              </Button>

              <Button color="secondary" outline onClick={toggleDetailModal}>
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </Modal>

          <EditBuildingsModal
            isOpen={editModal}
            toggle={toggleEditModal}
            data={row}
          />
        </div>
      );
    },
  },
];
