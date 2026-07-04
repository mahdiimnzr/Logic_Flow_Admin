import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import Cleave from "cleave.js/react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

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

const EditBuildingsModal = ({ isOpen, toggle, data }) => {
  const { t } = useTranslation();

  const [position, setPosition] = useState([data?.latitude, data?.longitude]);

  const options = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
  };

  const validationSchema = Yup.object({
    buildingName: Yup.string().required("DepartmentNameRequired"),
    floor: Yup.string().required("BuildingRequired"),
    latitude: Yup.string().required("BuildingRequired"),
    longitude: Yup.string().required("BuildingRequired"),
  });
  const defaultValues = {
    id: data?.id ?? "",
    buildingName: data?.buildingName ?? "",
    floor: data?.floor ?? "",
    latitude: data?.latitude ?? "",
    longitude: data?.longitude ?? "",
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

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered modal-lg"
      style={{
        fontFamily: "IRANYekanXFaNum",
      }}
    >
      <ModalHeader toggle={toggle} />
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <div className="text-center mb-2">
          <h1>{t("AddDepartment")}</h1>
        </div>
        <Row tag="form" className="gy-1" onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label className="form-label">{t("DepartmentName")}</Label>
            <Controller
              name="buildingName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  invalid={!!errors.buildingName}
                  placeholder={t("DepartmentNamePlaceholder")}
                />
              )}
            />
            {errors.buildingName && (
              <FormFeedback>{t(errors.buildingName.message)}</FormFeedback>
            )}
          </Col>
          <Col xs={12}>
            <Label className="form-label">{t("Building")}</Label>
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
                      placeholder={t("CourseFloor")}
                      onChange={(e) => field.onChange(e.target.rawValue)}
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
          <Col xs={12}>
            <Label className="form-label">انتخاب موقعیت</Label>
            <MapContainer
              center={[data?.latitude, data?.longitude]}
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
              <div className="invalid-feedback d-block">
                لطفا موقعیت مکانی را انتخاب کنید
              </div>
            )}
          </Col>
          <Col xs={12} className="d-flex justify-content-between mt-2">
            <Button color="primary" type="submit">
              {t("SaveChanges")}
            </Button>
            <Button color="secondary" outline onClick={toggle}>
              {t("Cancel")}
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default EditBuildingsModal;
