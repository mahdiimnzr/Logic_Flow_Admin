import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Eye } from "react-feather";
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
  InputGroup,
  UncontrolledTooltip,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { updateClassRooms } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";
import Cleave from "cleave.js/react";

export const columns = (t) => [
  {
    name: t("ClassRoomName"),
    sortable: true,
    minWidth: "200px",
    sortField: "classRoomName",
    selector: (row) => row.classRoomName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.classRoomName}</span>
    ),
  },

  {
    name: t("Building"),
    minWidth: "80px",
    sortable: true,
    sortField: "buildingName",
    selector: (row) => row.building.buildingName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {row.building.buildingName +
          " ( " +
          t("Floor") +
          ": " +
          row.building.floor +
          " )"}
      </span>
    ),
  },

  {
    name: t("Capacity"),
    minWidth: "80px",
    sortable: true,
    sortField: "capacity",
    selector: (row) => row.capacity,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.capacity}</span>
    ),
  },

  {
    name: t("Actions"),
    minWidth: "50px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();

      const options = {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
      };

      const buildings = queryClient.getQueryState(["Buildings"]);

      const [editModal, setEditModal] = useState(false);
      const [detailModal, setDetailModal] = useState(false);

      const [currentBuilding, setCurrentBuilding] = useState({
        value: row.buildingId,
        label:
          row.building.buildingName +
          " ( " +
          t("Floor") +
          ": " +
          row.building.floor +
          " )",
      });

      const buildingsOptions =
        buildings?.data?.data?.map((value) => ({
          value: value.id,
          label:
            value.buildingName + " ( " + t("Floor") + ": " + value.floor + " )",
        })) || [];

      const validationSchema = Yup.object({
        classRoomName: Yup.string().required("ClassRoomNameRequired"),
        capacity: Yup.string().required("CapacityRequired"),
        buildingId: Yup.string().required("BuildingRequired"),
      });

      const defaultValues = {
        id: row.id ?? "",
        classRoomName: row.classRoomName ?? "",
        capacity: row.capacity ?? "",
        buildingId: row.buildingId ?? "",
      };

      const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: updateDepartmentsMutate } = useMutation({
        mutationFn: updateClassRooms,

        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },

        onSuccess: (response, _, context) => {
          toast.success(response.data.message, {
            id: context.toastId,
          });

          queryClient.invalidateQueries({
            queryKey: ["ClassRooms"],
          });

          toggleEditModal();
        },

        onError: (response, _, context) => {
          toast.error(response.data.message, {
            id: context.toastId,
          });
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
            id={`EyeClassRoom-${row.id}`}
            size={17}
            className="me-50 cursor-pointer"
            onClick={toggleDetailModal}
          />
          <UncontrolledTooltip
            placement="top"
            target={`EyeClassRoom-${row.id}`}
          >
            جزئیات کلاس
          </UncontrolledTooltip>

          <Modal
            unmountOnClose={true}
            isOpen={detailModal}
            toggle={toggleDetailModal}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={toggleDetailModal}>
              {t("ClassRoom")}
            </ModalHeader>

            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("ClassRoomName")}</Label>
                <span className="text-muted mb-0">{row.classRoomName}</span>
              </div>

              <div className="mb-1 d-flex flex-column">
                <Label>{t("Building")}</Label>
                <span className="text-muted mb-0">
                  {row.building.buildingName +
                    " ( " +
                    t("Floor") +
                    ": " +
                    row.building.floor +
                    " )"}
                </span>
              </div>

              <div className="mb-1 d-flex flex-column">
                <Label>{t("Capacity")}</Label>
                <span className="text-muted mb-0">{row.capacity}</span>
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
            <ModalHeader className="bg-transparent" toggle={toggleEditModal} />

            <ModalBody className="px-sm-5 mx-50 pb-5">
              <div className="text-center mb-2">
                <h1 className="mb-1">{t("EditClassRoom")}</h1>
              </div>

              <Row
                tag="form"
                className="gy-1 pt-75"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Col xs={12}>
                  <Label className="form-label" for="classRoomName">
                    {t("ClassRoomName")}
                  </Label>

                  <Controller
                    name="classRoomName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="classRoomName"
                        placeholder={t("ClassRoomNamePlaceholder")}
                        invalid={!!errors.classRoomName}
                      />
                    )}
                  />

                  {errors.classRoomName && (
                    <FormFeedback>
                      {t(errors.classRoomName.message)}
                    </FormFeedback>
                  )}
                </Col>

                <Col xs={12}>
                  <Label className="form-label" for="capacity">
                    {t("Capacity")}
                  </Label>

                  <Controller
                    name="capacity"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputGroup className="input-group-merge">
                          <Cleave
                            className={`form-control ${
                              errors.capacity ? "is-invalid" : ""
                            }`}
                            placeholder={t("Capacity")}
                            options={options}
                            id="capacity"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.rawValue)}
                          />
                        </InputGroup>

                        {errors.capacity && (
                          <div className="invalid-feedback d-block">
                            {t(errors.capacity.message)}
                          </div>
                        )}
                      </>
                    )}
                  />
                </Col>

                <Col xs={12}>
                  <Label className="form-label" for="buildingId">
                    {t("Building")}
                  </Label>

                  <Controller
                    name="buildingId"
                    control={control}
                    render={() => (
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
