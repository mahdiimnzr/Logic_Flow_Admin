import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Edit, Eye, MoreVertical, TrendingUp } from "react-feather";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Row,
  Col,
  FormFeedback,
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
import { updateDepartments } from "../../core/services/api/ManagementCourses/ManagementCourses.service";
import { activeBuildings } from "../../core/services/api/buildings/buildings.service";

export const columns = (t) => [
  {
    name: t("Building"),
    minWidth: "80px",
    sortable: true,
    sortField: "buildingName",
    selector: (row) => row.buildingName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {row.buildingName + " ( طبقه: " + row.floor + " )"}
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
    name: "دوره های فعال و غیر فعال",
    minWidth: "164px",
    sortField: "balance",
    selector: (row) => row?.active,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row?.active ? "light-success" : "light-primary"}
        pill
      >
        {row?.active ? "فعال" : "غیر فعال"}
      </Badge>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "50px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();

      const buildings = queryClient.getQueryState(["Buildings"]);

      const [editModal, setEditModal] = useState(false);
      const [detailModal, setDetailModal] = useState(false);
      const [currentBuilding, setCurrentBuilding] = useState({
        value: row.buildingId,
        label: row.buildingName + " ( طبقه: " + row.floor + " )",
      });

      const buildingsOptions = buildings?.data?.data?.map((value) => {
        const building = {
          value: value.id,
          label: value.buildingName + " ( طبقه: " + value.floor + " )",
        };
        return building;
      });

      const validationSchema = Yup.object({
        depName: Yup.string().required("DepartmentNameRequired"),
        buildingId: Yup.string().required("BuildingRequired"),
      });
      const defaultValues = {
        id: row.id ?? "",
        depName: row.depName ?? "",
        buildingId: row.buildingId ?? "",
      };
      const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

      const { mutate: activeDepartmentMutate } = useMutation({
        mutationFn: activeBuildings,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          toast.success(response.data.message, { id: context.toastId });
          queryClient.invalidateQueries({
            queryKey: [`Buildings`],
          });
        },
        onError: (response, _, context) => {
          toast.error(response.data.message, { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateDepartmentsMutate(data);
      };

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
                  activeDepartmentMutate({
                    active: row.active === true ? false : true,
                    id: row.id,
                  });
                }}
              >
                <TrendingUp size={14} className="me-50" />
                <span className="align-middle">
                  {row.active == true ? t("DeActive") : t("Active")}
                </span>
              </DropdownItem>
              <DropdownItem
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  // activeDepartmentMutate({
                  //   active: row.active === true ? false : true,
                  //   id: row.id,
                  // });
                }}
              >
                <Edit size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Modal
            unmountOnClose={true}
            isOpen={detailModal}
            toggle={toggleDetailModal}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={toggleDetailModal}>
              {t("Department")}
            </ModalHeader>
            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("DepartmentName")}</Label>
                <span className="text-muted mb-0">{row.depName}</span>
              </div>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("Building")}</Label>
                <span className="text-muted mb-0">
                  {row.buildingName + " ( طبقه: " + row.floor + " )"}
                </span>
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
          <Modal
            isOpen={editModal}
            toggle={toggleEditModal}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader
              className="bg-transparent"
              toggle={toggleEditModal}
            ></ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-5">
              <div className="text-center mb-2">
                <h1 className="mb-1">{t("EditDepartment")}</h1>
              </div>
              <Row
                tag="form"
                className="gy-1 pt-75"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Col xs={12}>
                  <Label className="form-label" for="depName">
                    {t("DepartmentName")}
                  </Label>
                  <Controller
                    name="depName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="depName"
                        placeholder={t("DepartmentNamePlaceholder")}
                        invalid={!!errors.depName}
                      />
                    )}
                  />
                  {errors.depName && (
                    <FormFeedback>{t(errors.depName.message)}</FormFeedback>
                  )}
                </Col>
                <Col xs={12}>
                  <Label className="form-label" for="buildingId">
                    {t("Building")}
                  </Label>
                  <Controller
                    name="buildingId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        className={`react-select ${
                          errors.buildingId ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        options={buildingsOptions}
                        value={currentBuilding}
                        placeholder={t("BuildingPlaceholder")}
                        id="buildingId"
                        name="buildingId"
                        onChange={(data) => {
                          setCurrentBuilding(data);
                          setValue("buildingId", data.value);
                        }}
                      />
                    )}
                  />
                  {errors.buildingId && (
                    <FormFeedback>{t(errors.buildingId.message)}</FormFeedback>
                  )}
                </Col>
                <Col
                  xs={12}
                  className="text-center mt-2 pt-50 d-flex justify-content-between"
                >
                  <Button type="submit" className="me-1" color="primary">
                    {t("SaveChanges")}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    onClick={() => {
                      toggleEditModal();
                      toggleDetailModal();
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>
      );
    },
  },
];
