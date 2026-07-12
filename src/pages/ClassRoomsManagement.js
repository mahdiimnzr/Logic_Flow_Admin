import { useState } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Table from "../components/ManagementCourses/ClassRoomsManagement/Table";
import {
  Button,
  Col,
  FormFeedback,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import SubscribersGained from "../components/ManagementCourses/ClassRoomsManagement/SubscribersGained";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "@components/breadcrumbs";
import {
  useGetBuildings,
  useGetClassRooms,
  addClassRooms,
} from "../core/services/api/ManagementCourses/ManagementCourses.service";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import Cleave from "cleave.js/react";

const ClassRoomsManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const options = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
  };

  const { isLoading, isFetching, data: classRooms } = useGetClassRooms();
  const { isLoading: buildingLoading, data: buildings } = useGetBuildings();

  const [addModal, setAddModal] = useState(false);

  const [currentBuilding, setCurrentBuilding] = useState({
    value: "",
    label: t("BuildingPlaceholder"),
  });

  const buildingsOptions =
    buildings?.data?.map((value) => ({
      value: value.id,
      label: `${value.buildingName} (${t("Floor")} : ${value.floor})`,
    })) || [];

  const validationSchema = Yup.object({
    classRoomName: Yup.string().required("ClassRoomNameRequired"),
    capacity: Yup.string().required("CapacityRequired"),
    buildingId: Yup.string().required("BuildingRequired"),
  });

  const defaultValues = {
    classRoomName: "",
    capacity: "",
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

  const { mutate: addClassRoomsMutate } = useMutation({
    mutationFn: addClassRooms,

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

      toggleAddModal();
    },

    onError: (response, _, context) => {
      toast.error(response.data.message, {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => {
    addClassRoomsMutate(data);
  };

  const toggleAddModal = () => setAddModal(!addModal);

  return isLoading || buildingLoading ? (
    <Spinner />
  ) : (
    <>
      <Breadcrumbs
        title={t("ClassRoomsManagement")}
        data={[
          { title: t("ManagementCourses") },
          { title: t("ClassRoomsManagement") },
        ]}
      />

      <Row>
        <Col className="mb-1 mb-xl-0" xl="3" sm="12">
          <SubscribersGained
            title={t("ClassRoomsCount")}
            subscribers={classRooms?.data?.length || 0}
            series={[
              {
                name: t("ClassRooms"),
                data: [0, 25, 15, 50, 35, 70, classRooms?.data?.length || 0],
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
              {t("AddClassRoom")}
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
                  <h1 className="mb-1">{t("AddClassRoom")}</h1>
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
                              onChange={(e) =>
                                field.onChange(e.target.rawValue)
                              }
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
            <Table classRooms={classRooms?.data} isFetching={isFetching} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ClassRoomsManagement;
