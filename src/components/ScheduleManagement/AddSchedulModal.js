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
    label: t("SelectCourse"),
  });

  const [currentGroup, setCurrentGroup] = useState({
    value: null,
    label: t("SelectGroup"),
  });

  const coursesOptions = useMemo(
    () =>
      (courses?.data?.data?.courseDtos ?? []).map((course) => ({
        value: course.courseId,
        label: course.title,
      })),
    [courses],
  );

  const groupsOptions = useMemo(() => {
    const group = (courseGroups?.data?.data?.courseGroupDtos ?? []).filter(
      (value) => value.course.courseId == currentCourse.value,
    );

    return group.map((value) => ({
      value: value?.groupId,
      label: value?.groupName,
    }));
  }, [currentCourse, courseGroups]);

  const validationSchema = Yup.object({
    currentCurseId: Yup.string().required(t("CourseRequired")),
    courseGroupId: Yup.string().required(t("GroupRequired")),
    startDate: Yup.date().nullable().required(t("StartDateRequired")),
    startTime: Yup.date().nullable().required(t("StartTimeRequired")),
    endTime: Yup.date()
      .nullable()
      .min(Yup.ref("startTime"), t("EndTimeAfterStartTime"))
      .required(t("EndTimeRequired")),
  });

  const defaultValues = {
    currentCurseId: "",
    courseGroupId: "",
    startDate: null,
    startTime: null,
    endTime: null,
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
        queryClient.invalidateQueries({
          queryKey: ["TeacherSchedule"],
        });

        toggleAddModal();
      } else {
        toast.error(response?.data?.message || t("SomethingWentWrong"), {
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
    addBuildingMutate({
      currentCurseId: data.currentCurseId,
      courseGroupId: data.courseGroupId,
      startDate: data.startDate,
      startTime: formatTime(data.startTime),
      endTime: formatTime(data.endTime),
    });
  };

  useEffect(() => {
    setValue("startDate", addScheduleProp.startDate);
    setValue("startTime", addScheduleProp.startDate);
  }, [addScheduleProp, setValue]);

  return (
    <Modal
      isOpen={addModal}
      toggle={toggleAddModal}
      className="modal-dialog-centered"
      onClosed={() => {
        setValue("currentCurseId", "");
        setValue("courseGroupId", "");
        setValue("startDate", null);
        setValue("startTime", null);
        setValue("endTime", null);
      }}
      style={{
        fontFamily: "IRANYekanXFaNum",
      }}
    >
      <ModalHeader toggle={toggleAddModal}>{t("AddSchedule")}</ModalHeader>

      <ModalBody className="px-sm-5 mx-50 pb-5">
        <Row tag="form" className="gy-1" onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label className="form-label" for="currentCurseId">
              {t("SelectCourse")}
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
                  placeholder={t("SelectCourse")}
                  id="currentCurseId"
                  name="currentCurseId"
                  onChange={(data) => {
                    setCurrentCourse(data);
                    field.onChange(data.value);

                    setCurrentGroup({
                      value: null,
                      label: t("SelectGroup"),
                    });

                    setValue("courseGroupId", "");
                  }}
                  styles={{
                    option: (base) => ({
                      ...base,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }),
                  }}
                />
              )}
            />

            {errors.currentCurseId && (
              <FormFeedback>{errors.currentCurseId.message}</FormFeedback>
            )}
          </Col>
          <Col xs={12}>
            <Label className="form-label" for="courseGroupId">
              {t("SelectGroup")}
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
                  placeholder={t("SelectGroup")}
                  id="courseGroupId"
                  name="courseGroupId"
                  onChange={(data) => {
                    setCurrentGroup(data);
                    field.onChange(data.value);
                  }}
                  styles={{
                    option: (base) => ({
                      ...base,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }),
                  }}
                />
              )}
            />

            {errors.courseGroupId && (
              <FormFeedback>{errors.courseGroupId.message}</FormFeedback>
            )}
          </Col>

          <Col md="12" className="mb-1">
            <Label className="form-label" for="startDate">
              {t("StartDate")}
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

          <Col xs="6">
            <Label className="form-label" id="startTime">
              {t("StartTime")}
            </Label>

            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className={`form-control ${
                    errors.startTime ? "is-invalid" : ""
                  }`}
                  style={{ opacity: 1 }}
                  value={field.value ? new Date(field.value) : null}
                  id="startTime"
                  placeholder={t("StartTime")}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
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

          <Col xs="6">
            <Label className="form-label" id="endTime">
              {t("EndTime")}
            </Label>

            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className={`form-control ${
                    errors.endTime ? "is-invalid" : ""
                  }`}
                  style={{ opacity: 1 }}
                  value={field.value ? new Date(field.value) : null}
                  id="endTime"
                  placeholder={t("EndTime")}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                  }}
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
              {t("AddSchedule")}
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
