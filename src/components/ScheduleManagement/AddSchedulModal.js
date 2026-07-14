import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { addSchedule } from "../../core/services/api/scheduleManagement/scheduleManagement.service";
import * as Yup from "yup";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
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
import { useTranslation } from "react-i18next";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const AddScheduleModal = ({ addModal, toggleAddModal, addScheduleProp }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const courses = queryClient.getQueryState(["ScheduleCoursesFilterAdmin"]);
  const courseGroups = queryClient.getQueryState(["AdminScheduleCourseGroups"]);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-GB", {
      timeZone: "Asia/Tehran",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const [currentCourse, setCurrentCourse] = useState({
    value: null,
    label: t("UsersSelection"),
  });
  const [currentGroup, setCurrentGroup] = useState({
    value: null,
    label: t("UsersSelection"),
  });

  const coursesOptions = useMemo(
    () =>
      (courses?.data?.data?.courseDtos ?? []).map((user) => ({
        value: user.courseId,
        label: user.title,
      })),
    [courses],
  );
  const groupsOptions = useMemo(() => {
    const group = (courseGroups?.data?.data?.courseGroupDtos ?? [])?.filter(
      (value) => value.course.courseId == currentCourse.value,
    );
    return (group ?? [])?.map((value) => ({
      value: value.groupId,
      label: value.groupName,
    }));
  }, [currentCourse]);

  const validationSchema = Yup.object({
    currentCurseId: Yup.string().required("BuildingNameRequired"),
    courseGroupId: Yup.string().required("BuildingNameRequired"),
    startDate: Yup.string().nullable().required("FloorRequired"),
    startTime: Yup.string().nullable().required("SelectLocationRequired"),
    endTime: Yup.string().nullable().required("SelectLocationRequired"),
  });

  const defaultValues = {
    currentCurseId: "",
    courseGroupId: "",
    startDate: null,
    startTime: "",
    endTime: "",
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { mutate: addBuildingMutate } = useMutation({
    mutationFn: addSchedule,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, {
          id: context.toastId,
        });
        queryClient.invalidateQueries({
          queryKey: ["AdminSchedule"],
        });
        toggleAddModal();
        setValue("currentCurseId", "");
        setValue("courseGroupId", "");
        setValue("startDate", null);
        setValue("startTime", "");
        setValue("endTime", "");
      } else if (!response.data.success) {
        toast.error(error?.response?.data?.message || t("SomethingWentWrong"), {
          id: context.toastId,
        });
      }
    },
    onError: (response, _, context) => {
      toast.error(response?.data?.message || t("SomethingWentWrong"), {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => {
    const values = {
      currentCurseId: data.currentCurseId,
      courseGroupId: data.courseGroupId,
      startDate: data.startDate,
      startTime: formatTime(data.startTime),
      endTime: formatTime(data.endTime),
    };
    addBuildingMutate(values);
  };

  useEffect(() => {
    setValue("startDate", addScheduleProp.startDate);
    setValue("startTime", addScheduleProp.startDate);
  }, [addScheduleProp]);
  return (
    <Modal
      isOpen={addModal}
      toggle={toggleAddModal}
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
        <Row tag="form" className="gy-1" onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label className="form-label" for="currentCurseId">
              {t("Building")}
            </Label>

            <Controller
              name="currentCurseId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.currentCurseId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  options={coursesOptions}
                  value={currentCourse}
                  placeholder={t("BuildingPlaceholder")}
                  id="currentCurseId"
                  name="currentCurseId"
                  onChange={(data) => {
                    setCurrentCourse(data);
                    field.onChange(data.value);
                    setCurrentGroup({
                      value: null,
                      label: t("UsersSelection"),
                    });
                    setValue("courseGroupId", "");
                  }}
                />
              )}
            />

            {errors.currentCurseId && (
              <FormFeedback>{t(errors.currentCurseId.message)}</FormFeedback>
            )}
          </Col>
          <Col xs={12}>
            <Label className="form-label" for="courseGroupId">
              {t("Building")}
            </Label>

            <Controller
              name="courseGroupId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.courseGroupId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  options={groupsOptions}
                  value={currentGroup}
                  placeholder={t("BuildingPlaceholder")}
                  id="courseGroupId"
                  name="courseGroupId"
                  onChange={(data) => {
                    setCurrentGroup(data);
                    field.onChange(data.value);
                  }}
                />
              )}
            />

            {errors.courseGroupId && (
              <FormFeedback>{t(errors.courseGroupId.message)}</FormFeedback>
            )}
          </Col>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="startDate">
              {t("CourseStartDate")} :
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
          <Col xs="6" dir="ltr">
            <Label className="form-label" id="startTime">
              Basic 24hrs
            </Label>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  style={{ direction: "ltr" }}
                  className="form-control"
                  value={field.value ? new Date(field.value) : null}
                  id="startTime"
                  placeholder="زمان شروع انتخاب کنید"
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
                  dir="ltr"
                  onChange={(date) => {
                    const value = new Date(date);
                    field.onChange(value.toISOString());
                  }}
                />
              )}
            />
            {errors.startTime && (
              <span className="invalid-feedback d-block">
                {errors.startTime.message}
              </span>
            )}
          </Col>
          <Col xs="6" dir="ltr">
            <Label className="form-label" id="endTime">
              Basic 24hrs
            </Label>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  style={{ direction: "ltr" }}
                  className="form-control"
                  value={field.value ? new Date(field.value) : null}
                  placeholder="زمان پایان انتخاب کنید"
                  id="endTime"
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
                  dir="ltr"
                  onChange={(date) => {
                    const value = new Date(date);
                    field.onChange(value.toISOString());
                  }}
                />
              )}
            />
            {errors.endTime && (
              <span className="invalid-feedback d-block">
                {errors.endTime.message}
              </span>
            )}
          </Col>
          <Col xs={12} className="d-flex justify-content-between mt-2">
            <Button color="primary" type="submit">
              افزودن زمان بندی
            </Button>
            <Button color="secondary" outline onClick={toggleAddModal}>
              {t("Cancel")}
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default AddScheduleModal;
