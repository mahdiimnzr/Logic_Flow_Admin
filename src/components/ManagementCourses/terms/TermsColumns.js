import { Link } from "react-router-dom";
import Avatar from "@components/avatar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";
import { updateTerm } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";
import formatDate from "../../../core/utils/formatDate";
import { Edit, Clock } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import EditCloseDateModal from "./EditCloseDateModal";

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
      content={row?.fName?.toUpperCase() + row?.lName?.toUpperCase() || "Unknown"}
    />
  );
};

const statusObj = {
  active: "light-success",
  deActive: "light-danger",
};

export const columns = (t) => [
  {
    name: t("Id"),
    sortable: true,
    sortField: "id",
    minWidth: "107px",
    selector: (row) => row.id,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.id}</span>
    ),
  },
  {
    name: t("TermName"),
    sortable: true,
    minWidth: "200px",
    sortField: "termName",
    selector: (row) => row.termName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.termName}</span>
    ),
  },
  {
    name: t("StartEndDate"),
    minWidth: "80px",
    sortable: true,
    sortField: "startDate",
    selector: (row) => row.startDate,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {formatDate(row.startDate)} تا {formatDate(row.endDate)}
      </span>
    ),
  },
  {
    name: t("Status"),
    minWidth: "138px",
    sortable: true,
    sortField: "expire",
    selector: (row) => row.expire,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={row?.expire ? statusObj.deActive : statusObj.active}
        pill
      >
        {row.expire ? t("Expired") : t("NotExpired")}
      </Badge>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "300px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();

      const [centeredModal, setCenteredModal] = useState(false);
      const [updateCloseDateModal, setUpdateCloseDateModal] = useState(false);

      const toggleUpdateCloseDate = () => setUpdateCloseDateModal(!updateCloseDateModal);

      const validationSchema = Yup.object({
        termName: Yup.string().required("TermNameRequired"),
        startDate: Yup.date().nullable().required("StartDateRequired"),
        endDate: Yup.date()
          .min(Yup.ref("startDate"), "EndDateAfterStart")
          .nullable()
          .required("EndDateRequired"),
      });

      const defaultValues = {
        id: row?.id ?? "",
        termName: row?.termName ?? "",
        startDate: row?.startDate ?? null,
        endDate: row?.endDate ?? null,
        expire: row?.expire ?? false,
      };

      const [currentStatus, setCurrentStatus] = useState({
        value: row?.expire ? "active" : "deActive",
        label: row.expire ? t("Expired") : t("NotExpired"),
      });

      const statusOptions = [
        { value: "active", label: t("Expired") },
        { value: "deActive", label: t("NotExpired") },
      ];

      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: updateTermMutate } = useMutation({
        mutationFn: updateTerm,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["Term"] });
            setCenteredModal(false);
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateTermMutate(data);
      };

      return (
        <div className="column-action d-flex gap-1">
          <Edit
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setCenteredModal(true)}
          />
          <Clock
            size={17}
            className="me-50 cursor-pointer"
            onClick={toggleUpdateCloseDate}
          />

          <Modal
            style={{ fontFamily: "IRANYekanXFaNum" }}
            isOpen={centeredModal}
            toggle={() => setCenteredModal(!centeredModal)}
            className="modal-dialog-centered"
          >
            <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
              {t("EditTerm")}
            </ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-5">
              <Row tag="form" className="gy-1 pt-75" onSubmit={handleSubmit(onSubmit)}>
                <Col xs={12}>
                  <Label className="form-label" for="termName">
                    {t("TermName")}
                  </Label>
                  <Controller
                    name="termName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="termName"
                        placeholder={t("TermName")}
                        invalid={!!errors.termName}
                      />
                    )}
                  />
                  {errors.termName && (
                    <span className="invalid-feedback d-block">
                      {t(errors.termName.message)}
                    </span>
                  )}
                </Col>

                <Col md="6">
                  <Label className="form-label" for="startDate">
                    {t("StartDate")}
                  </Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <>
                        <DatePicker
                          calendar={persian}
                          locale={persian_fa}
                          value={field.value ? new Date(field.value) : null}
                          editable={false}
                          placeholder={t("DatePlaceholder")}
                          onChange={(date) =>
                            field.onChange(date ? date.toDate().toISOString() : null)
                          }
                          inputClass={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                          containerStyle={{ width: "100%" }}
                        />
                        {errors.startDate && (
                          <span className="invalid-feedback d-block">
                            {t(errors.startDate.message)}
                          </span>
                        )}
                      </>
                    )}
                  />
                </Col>

                <Col md="6">
                  <Label className="form-label" for="endDate">
                    {t("EndDate")}
                  </Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <>
                        <DatePicker
                          calendar={persian}
                          locale={persian_fa}
                          value={field.value ? new Date(field.value) : null}
                          editable={false}
                          placeholder={t("DatePlaceholder")}
                          onChange={(date) =>
                            field.onChange(date ? date.toDate().toISOString() : null)
                          }
                          inputClass={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                          containerStyle={{ width: "100%" }}
                        />
                        {errors.endDate && (
                          <span className="invalid-feedback d-block">
                            {t(errors.endDate.message)}
                          </span>
                        )}
                      </>
                    )}
                  />
                </Col>

                <Col md="12">
                  <Label for="status-select">{t("Status")}</Label>
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={statusOptions}
                    value={currentStatus}
                    onChange={(data) => {
                      setCurrentStatus(data);
                      setValue("expire", data.value === "active");
                    }}
                  />
                </Col>

                <Col xs={12} className="text-center mt-2 pt-50 d-flex align-items-center justify-content-between">
                  <Button type="submit" className="me-1" color="primary">
                    {t("SaveChanges")}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    onClick={() => setCenteredModal(false)}
                  >
                    {t("Cancel")}
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>

          <EditCloseDateModal
            toggleUpdate={toggleUpdateCloseDate}
            isOpen={updateCloseDateModal}
            row={row}
          />
        </div>
      );
    },
  },
];