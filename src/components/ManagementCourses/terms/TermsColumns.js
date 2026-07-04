// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Icons Imports

// ** Reactstrap Imports
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
import { AlignJustify, MoreVertical } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import EditCloseDateModal from "./EditCloseDateModal";

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
      {/* {row.roles.join(", ")} */}
    </span>
  );
};

const statusObj = {
  active: "light-success",
  deActive: "light-danger",
};

export const columns = [
  {
    name: "#آیدی",
    sortable: true,
    sortField: "id",
    minWidth: "107px",
    selector: (row) => row.id,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.id}</span>
    ),
  },
  {
    name: "نام ترم ها",
    sortable: true,
    minWidth: "200px",
    sortField: "role",
    selector: (row) => row.termName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.termName}</span>
    ),
  },

  {
    name: "تاریخ شروع / پایان",
    minWidth: "80px",
    sortable: true,
    sortField: "insertDate",
    selector: (row) => row.insertDate,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {formatDate(row.startDate)} تا {formatDate(row.endDate)}
      </span>
    ),
  },

  {
    name: "وضعیت",
    minWidth: "138px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.expire,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <Badge
          className="text-capitalize"
          color={row?.expire ? statusObj.deActive : statusObj.active}
          pill
        >
          {row.expire ? "منقضی شده " : "منقضی نشده "}
        </Badge>
      );
    },
  },
  {
    name: "اقدام",
    minWidth: "300px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();
      const [centeredModal, setCenteredModal] = useState(false);
      const [updateCloseDateModal, setUpdateCloseDateModal] = useState(false);

      const toggleUpdateCloseDate = () =>
        setUpdateCloseDateModal(!updateCloseDateModal);

      const validationSchema = Yup.object({
        termName: Yup.string().required(".........."),
        startDate: Yup.string().required("........."),
        endDate: Yup.string().required("..........."),
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
        label: row.expire ? "منقضی شده" : "منقضی نشده",
      });

      const statusOptions = [
        // { value: null, label: t("StatusSelection") },
        { value: "active", label: "منقضی شده" },
        { value: "deActive", label: "منقضی نشده" },
      ];

      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });
      // ** Handle Submit
      const { mutate: updateTermMutate } = useMutation({
        mutationFn: updateTerm,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({
              queryKey: [`Term`],
            });
            setCenteredModal(false);
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (response, _, context) => {
          toast.error(response.data.message, { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateTermMutate(data);
      };
      return (
        <div className="column-action d-flex gap-1">
          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <MoreVertical size={17} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  setCenteredModal(!centeredModal);
                }}
              >
                <AlignJustify size={14} className="me-50" />
                <span className="align-middle">ویرایش ترم</span>
              </DropdownItem>
              <DropdownItem className="w-100" onClick={toggleUpdateCloseDate}>
                <AlignJustify size={14} className="me-50" />
                <span className="align-middle">ویرایش زمان</span>
              </DropdownItem>
              <Modal
                style={{ fontFamily: "IRANYekanXFaNum" }}
                isOpen={centeredModal}
                toggle={() => setCenteredModal(!centeredModal)}
                className="modal-dialog-centered"
              >
                <ModalHeader
                  className="bg-transparent"
                  toggle={() => setCenteredModal(!centeredModal)}
                ></ModalHeader>
                <ModalBody className="px-sm-5 mx-50 pb-5">
                  <div className="text-center mb-2">
                    <h1 className="mb-1">ویرایش اطلاعات ترم</h1>
                  </div>
                  <Row
                    tag="form"
                    className="gy-1 pt-75"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Col xs={12}>
                      <Label className="form-label" for="termName">
                        نام ترم
                      </Label>
                      <Controller
                        name="termName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="termName"
                            placeholder=" نام ترم"
                            invalid={errors.termName && true}
                          />
                        )}
                      />
                      {errors.termName && (
                        <span className="invalid-feedback d-block">
                          {errors.termName.message}
                        </span>
                      )}
                    </Col>
                    <Col md="6" className="mb-1">
                      <Label className="form-label" for="startDate">
                        زمان شروع
                      </Label>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <>
                            <DatePicker
                              id="startDate"
                              calendar={persian}
                              locale={persian_fa}
                              calendarPosition="bottom-right"
                              value={field.value ? new Date(field.value) : null}
                              editable={false}
                              placeholder={t("DatePlaceholder")}
                              onChange={(date) => {
                                if (date) {
                                  field.onChange(date.toDate().toISOString());
                                } else {
                                  field.onChange(null);
                                }
                              }}
                              inputClass={`form-control ${
                                errors.startDate ? "is-invalid" : ""
                              }`}
                              containerStyle={{ width: "100%" }}
                            />
                            {errors.startDate && (
                              <span className="invalid-feedback d-block">
                                {errors.startDate.message}
                              </span>
                            )}
                          </>
                        )}
                      />
                    </Col>
                    <Col md="6" className="mb-1">
                      <Label className="form-label" for="endDate">
                        زمان پایان
                      </Label>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <>
                            <DatePicker
                              id="endDate"
                              calendar={persian}
                              locale={persian_fa}
                              calendarPosition="bottom-right"
                              value={field.value ? new Date(field.value) : null}
                              editable={false}
                              placeholder={t("DatePlaceholder")}
                              onChange={(date) => {
                                if (date) {
                                  field.onChange(date.toDate().toISOString());
                                } else {
                                  field.onChange(null);
                                }
                              }}
                              inputClass={`form-control ${
                                errors.endDate ? "is-invalid" : ""
                              }`}
                              containerStyle={{ width: "100%" }}
                            />
                            {errors.endDate && (
                              <span className="invalid-feedback d-block">
                                {errors.endDate.message}
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
                          const value =
                            data.value === "active"
                              ? true
                              : data.value === "deActive"
                              ? false
                              : data.value;
                          setValue("expire", value);
                        }}
                      />
                    </Col>
                    <Col xs={12} className="text-center mt-2 pt-50">
                      <Button type="submit" className="me-1" color="primary">
                        تغیرات
                      </Button>
                      <Button
                        color="secondary"
                        outline
                        onClick={() => setCenteredModal(!centeredModal)}
                      >
                        منصرف
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
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    },
  },
];
