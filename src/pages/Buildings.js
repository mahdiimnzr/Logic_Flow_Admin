import { Fragment, useEffect, useMemo, useState } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Table from "../components/buildings/Table";
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
import SubscribersGained from "../components/buildings/SubscribersGained";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "@components/breadcrumbs";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Cleave from "cleave.js/react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  addBuildings,
  useGetAddressByCoordination,
} from "../core/services/api/buildings/buildings.service";
import { useGetBuildings } from "../core/services/api/ManagementCourses/ManagementCourses.service";

const MapMarker = ({ position, setPosition, setValue }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setValue("latitude", e.latlng.lat);
      setValue("longitude", e.latlng.lng);
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom(), { animate: true, duration: 0.5 });
  }, [position]);

  return position === null ? null : <Marker position={position} />;
};

const Buildings = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const options = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
  };

  const [addModal, setAddModal] = useState(false);

  const [position, setPosition] = useState([35.6944, 51.4215]);

  const validationSchema = Yup.object({
    buildingName: Yup.string().required("BuildingNameRequired"),
    floor: Yup.string().required("FloorRequired"),
    latitude: Yup.string().required("SelectLocationRequired"),
    longitude: Yup.string().required("SelectLocationRequired"),
  });

  const defaultValues = {
    buildingName: "",
    floor: "",
    latitude: "",
    longitude: "",
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

  const { isLoading, isFetching, data: buildings } = useGetBuildings();

  const addressesQueries = useGetAddressByCoordination(
    buildings?.data ?? [],
    !isLoading,
  );

  const formatAddressFromProperties = (properties) => {
    if (!properties) return "";

    return [
      properties.name,
      properties.housenumber,
      properties.street,
      properties.city,
      properties.state,
      properties.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const buildingsList = useMemo(() => {
    return (buildings?.data ?? []).map((item, index) => ({
      ...item,
      buildingAddress:
        addressesQueries[index]?.data?.data?.features?.length > 0
          ? formatAddressFromProperties(
              addressesQueries[index].data.data.features[0].properties,
            )
          : t("AddressNotfound"),
    }));
  }, [buildings, addressesQueries]);

  const dataLoading =
    addressesQueries.some((item) => item.isLoading) || isLoading;

  const toggleAddModal = () => {
    setAddModal((prev) => !prev);
  };

  const { mutate: addBuildingMutate } = useMutation({
    mutationFn: addBuildings,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success(response.data.message, {
        id: context.toastId,
      });
      queryClient.invalidateQueries({
        queryKey: ["Buildings"],
      });
      toggleAddModal();
      setValue("buildingName", "");
      setValue("floor", "");
      setValue("latitude", "");
      setValue("longitude", "");
    },
    onError: (error, _, context) => {
      toast.error(error?.response?.data?.message || t("SomethingWentWrong"), {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => {
    addBuildingMutate(data);
  };

  return dataLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs title={t("Buildings")} data={[{ title: t("Buildings") }]} />
      <Row>
        <Col xl="3" sm="12">
          <SubscribersGained
            title={t("BuildingsCount")}
            subscribers={buildingsList.length}
            series={[
              {
                name: t("Buildings"),
                data: [0, 25, 15, 50, 35, 70, buildingsList.length],
              },
            ]}
          />
          <div className="d-flex align-items-center table-header-actions">
            <Button block color="primary" onClick={toggleAddModal}>
              {t("AddBuilding")}
            </Button>
            <Modal
              isOpen={addModal}
              toggle={toggleAddModal}
              onOpened={() => {
                setValue("buildingName", "");
                setValue("floor", "");
                setValue("latitude", "");
                setValue("longitude", "");
              }}
              className="modal-dialog-centered modal-lg"
              style={{
                fontFamily: "IRANYekanXFaNum",
              }}
            >
              <ModalHeader toggle={toggleAddModal} />
              <ModalBody className="px-sm-5 mx-50 pb-5">
                <div className="text-center mb-2">
                  <h1>{t("AddBuilding")}</h1>
                </div>
                <Row
                  tag="form"
                  className="gy-1"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Col xs={12}>
                    <Label className="form-label">{t("BuildingName")}</Label>
                    <Controller
                      name="buildingName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          invalid={!!errors.buildingName}
                          placeholder={t("BuildingNamePlaceholder")}
                        />
                      )}
                    />
                    {errors.buildingName && (
                      <FormFeedback>
                        {t(errors.buildingName.message)}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col xs={12}>
                    <Label className="form-label">{t("Floor")}</Label>
                    <Controller
                      name="floor"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup>
                            <Cleave
                              className={`form-control ${
                                errors.floor ? "is-invalid" : ""
                              }`}
                              options={options}
                              value={field.value}
                              placeholder={t("FloorPlaceholder")}
                              onChange={(e) =>
                                field.onChange(e.target.rawValue)
                              }
                            />
                          </InputGroup>
                          {errors.floor && (
                            <div className="invalid-feedback d-block">
                              {t(errors.floor.message)}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </Col>
                  <Col dir="ltr" className="d-flex flex-column" xs={12}>
                    <Label
                      className={`form-label ${
                        i18n.language == "fa"
                          ? "align-self-end"
                          : "align-self-start"
                      }`}
                    >
                      {t("SelectLocation")}
                    </Label>
                    <MapContainer
                      center={[35.6944, 51.4215]}
                      zoom={13}
                      style={{
                        width: "100%",
                        height: "270px",
                        borderRadius: "16px",
                        zIndex: "10",
                      }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <MapMarker
                        position={position}
                        setPosition={setPosition}
                        setValue={setValue}
                      />
                    </MapContainer>
                    {(errors.latitude || errors.longitude) && (
                      <div className={`invalid-feedback d-block`}>
                        {t("SelectLocationRequired")}
                      </div>
                    )}
                  </Col>
                  <Col xs={12} className="d-flex justify-content-between mt-2">
                    <Button color="primary" type="submit">
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
