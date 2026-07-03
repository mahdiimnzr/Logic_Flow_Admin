import { Fragment, useState } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Table from "../components/buildings/Table";
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import SubscribersGained from "../components/buildings/SubscribersGained";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "@components/breadcrumbs";
import {
  addDepartments,
  useGetBuildings,
  useGetDepartments,
} from "../core/services/api/ManagementCourses/ManagementCourses.service";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import { useGetAddressByCoordination } from "../core/services/api/buildings/buildings.service";

const Buildings = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const formatAddressFromProperties = (properties) => {
    if (!properties) return "";
    const parts = [
      properties.name,
      properties.housenumber,
      properties.street,
      properties.city,
      properties.state,
      properties.country,
    ];
    return parts.filter(Boolean).join(", ");
  };

  const { isLoading, isFetching, data: buildings } = useGetBuildings();

  const addressesQueries = useGetAddressByCoordination(
    buildings?.data ?? [],
    !isLoading && !!buildings,
  );
  const buildingsList = buildings?.data
    .filter((_, index) => addressesQueries[index]?.isSuccess)
    .map((value, index) => ({
      ...value,
      buildingAddress:
        formatAddressFromProperties(
          addressesQueries[index]?.data?.data?.features[0].properties,
        ) ?? "آدرسی یافت نشد!",
    }));

  const dataLoading =
    addressesQueries.some((value) => value.isLoading) || isLoading;

  const [addModal, setAddModal] = useState(false);

  const [currentBuilding, setCurrentBuilding] = useState({
    value: "",
    label: t("BuildingPlaceholder"),
  });

  const buildingsOptions =
    buildingsList?.map((value) => ({
      value: value.id,
      label: `${value.buildingName} ( ${t("Floor")} : ${value.floor} )`,
    })) || [];

  const validationSchema = Yup.object({
    depName: Yup.string().required("DepartmentNameRequired"),
    buildingId: Yup.string().required("BuildingRequired"),
  });

  const defaultValues = {
    depName: "",
    buildingId: "",
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

  const { mutate: addDepartmentsMutate } = useMutation({
    mutationFn: addDepartments,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },

    onSuccess: (response, _, context) => {
      toast.success(response.data.message, {
        id: context.toastId,
      });

      queryClient.invalidateQueries({
        queryKey: ["Departments"],
      });

      toggleAddModal();
    },

    onError: (response, _, context) => {
      toast.error(response.data.message, {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => {
    addDepartmentsMutate(data);
  };

  const toggleAddModal = () => setAddModal(!addModal);

  return dataLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("DepartmentsManagement")}
        data={[
          { title: t("Departments") },
          { title: t("DepartmentsManagement") },
        ]}
      />

      <Row>
        <Col className="mb-1 mb-xl-0" xl="3" sm="12">
          <SubscribersGained
            title={t("DepartmentsCount")}
            subscribers={buildingsList?.length || 0}
            series={[
              {
                name: t("Departments"),
                data: [0, 25, 15, 50, 35, 70, buildingsList?.length || 0],
              },
            ]}
          />
          <div className="d-flex align-items-center table-header-actions">
            <Button
              block
              className="add-new-user"
              color="primary"
              onClick={toggleAddModal}
            >
              {t("AddDepartment")}
            </Button>
            <Modal
              isOpen={addModal}
              toggle={toggleAddModal}
              className="modal-dialog-centered"
              style={{ fontFamily: "IRANYekanXFaNum" }}
            >
              <ModalHeader className="bg-transparent" toggle={toggleAddModal} />
              <ModalBody className="px-sm-5 mx-50 pb-5">
                <div className="text-center mb-2">
                  <h1 className="mb-1">{t("AddDepartment")}</h1>
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
                      <FormFeedback>
                        {t(errors.buildingId.message)}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col
                    xs={12}
                    className="text-center mt-2 pt-50 d-flex justify-content-between"
                  >
                    <Button type="submit" className="me-1" color="primary">
                      {t("SaveChanges")}
                    </Button>

                    <Button color="secondary" outline onClick={toggleAddModal}>
                      {t("Cancel")}
                    </Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          </div>
        </Col>
        <Col xl="9" sm="12">
          <div className="app-user-list">
            <Table buildings={buildingsList} isFetching={isFetching} />
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Buildings;
