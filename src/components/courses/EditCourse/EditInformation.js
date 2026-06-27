import { Fragment, useState } from "react";

import Select from "react-select";
import Cleave from "cleave.js/react";
import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.ir";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  InputGroup,
} from "reactstrap";

import ImageFallBack from "../../common/ImageFallback";
import profile from "/public/Profile.png";

import { selectThemeColors } from "@utils";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { updateUserDetail } from "../../../core/services/api/Users/users.service";
import { updateCourseDetail } from "../../../core/services/api/CourseList/courseList.service";
import formDataConverter from "../../../core/utils/formDataConvertor";

const validationSchema = Yup.object({
  Title: Yup.string().required("CourseTitleRequired"),
  Describe: Yup.string().required("CourseDescribeRequired"),
  MiniDescribe: Yup.string().required("CourseMiniDescribeRequired"),
  Capacity: Yup.string().required("CourseCapacityRequired"),
  CourseTypeId: Yup.string().required("CourseTypeIdRequired"),
  SessionNumber: Yup.string().required("CourseSessionNumberRequired"),
  CurrentCoursePaymentNumber: Yup.string().required(
    "CourseCurrentPaymentNumberRequired",
  ),
  TremId: Yup.string().required("CourseTremIdRequired"),
  ClassId: Yup.string().required("CourseClassIdRequired"),
  CourseLvlId: Yup.string().required("CourseLvlIdRequired"),
  TeacherId: Yup.string().required("CourseTeacherIdRequired"),
  Cost: Yup.string().required("CourseCostRequired"),
  UniqeUrlString: Yup.string().required("CourseUniqeUrlStringRequired"),
  imageAddress: Yup.string().required("CourseImageAddressRequired"),
  TumbImageAddress: Yup.string().required("CourseTumbImageAddressRequired"),
  StartTime: Yup.string().nullable().required("CourseStartTimeRequired"),
  EndTime: Yup.string().nullable().required("CourseEndTimeRequired"),
  GoogleSchema: Yup.string().required("CourseGoogleSchemaRequired"),
  GoogleTitle: Yup.string().required("CourseGoogleTitleRequired"),
  CoursePrerequisiteId: Yup.string().nullable().optional(),
  ShortLink: Yup.string().required("CourseShortLinkRequired"),
  CourseStatusId: Yup.string().required("CourseStatusIdRequired"),
});

const AccountSetting = ({ data, usersList }) => {
  const { courseId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const CourseLevels = queryClient.getQueryState(["CourseLevels"]);
  const CourseStatus = queryClient.getQueryState(["CourseStatus"]);
  const CourseTypes = queryClient.getQueryState(["CourseTypes"]);
  const CourseTerms = queryClient.getQueryState(["CourseTerms"]);
  const CourseClassRoom = queryClient.getQueryState(["CourseClassRoom"]);
  const teachers = usersList?.listUser?.filter((value) =>
    value.userRoles.includes("teacher"),
  );

  const fundedLevel = CourseLevels?.data?.data?.find(
    (value) => value.id == data.courseLvlId,
  );
  const fundedStatus = CourseStatus?.data?.data?.find(
    (value) => value.id == data.statusId,
  );
  const fundedTeacher = teachers?.find((value) => value.id == data.teacherId);

  const [currentLevel, setCurrentLevel] = useState({
    value: data.courseLvlId,
    label: fundedLevel?.levelName,
  });
  const [currentStatus, setCurrentStatus] = useState({
    value: data.statusId,
    label: fundedStatus?.statusName,
  });
  const [currentTypes, setCurrentTypes] = useState({
    value: null,
    label: t("CourseTypeId"),
  });
  const [currentTerms, setCurrentTerms] = useState({
    value: null,
    label: t("CourseTremId"),
  });
  const [currentClassRoom, setCurrentClassRoom] = useState({
    value: null,
    label: t("CourseClassId"),
  });
  const [currentTeacher, setCurrentTeacher] = useState({
    value: data.teacherId,
    label: fundedTeacher?.fName + " " + fundedTeacher?.lName,
  });

  const levelsList = CourseLevels?.data?.data?.map((value) => {
    const levels = { value: value.id, label: value.levelName };
    return levels;
  });
  const statusList = CourseStatus?.data?.data?.map((value) => {
    const status = { value: value.id, label: value.statusName };
    return status;
  });
  const classRoomsList = CourseClassRoom?.data?.data?.map((value) => {
    const classRooms = {
      value: value.id,
      label: value.classRoomName + ` (ظرفیت : ${value.capacity})`,
    };
    return classRooms;
  });
  const termsList = CourseTerms?.data?.data?.map((value) => {
    const terms = { value: value.id, label: value.termName };
    return terms;
  });
  const typesList = CourseTypes?.data?.data?.map((value) => {
    const types = { value: value.id, label: value.typeName };
    return types;
  });
  const teachersList = teachers?.map((value) => {
    const teachers = {
      value: value.id,
      label: value.fName + " " + value.lName,
    };
    return teachers;
  });
  const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

  const defaultValues = {
    Id: courseId,
    Title: data?.title ?? "",
    Describe: data?.describe ?? "",
    MiniDescribe: data?.miniDescribe ?? "",
    Capacity: data?.capacity ?? "",
    CourseTypeId: "",
    SessionNumber: "",
    CurrentCoursePaymentNumber: "",
    TremId: "",
    ClassId: "",
    CourseLvlId: data?.courseLvlId ?? "",
    TeacherId: data?.teacherId ?? "",
    Cost: data?.cost ?? "",
    UniqeUrlString: "",
    StartTime: data?.startTime ?? null,
    EndTime: data?.endTime ?? null,
    GoogleSchema: "",
    GoogleTitle: data?.googleTitle ?? "",
    CoursePrerequisiteId: null,
    ShortLink: "",
    TumbImageAddress: data?.tumbImageAddress ?? "",
    imageAddress: data?.imageAddress ?? "",
    CourseStatusId: data?.statusId ?? "",
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const { mutate: updateCourseMutate } = useMutation({
    mutationFn: updateCourseDetail,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`CourseDetail-${courseId}`],
        });
        navigate(`/Courses/Detail/${courseId}`);
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    const formData = formDataConverter(data);
    updateCourseMutate(formData);
  };
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("UpdateCourse")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex align-items-center gap-3">
            <div className="me-25">
              <ImageFallBack
                className="rounded me-50"
                src={data?.imageAddress}
                fallback={profile}
                alt="Generic placeholder image"
                height="100"
                width="200"
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <div className={`d-flex flex-row align-items-center gap-1`}>
                <Label>{t("Teacher")} :</Label>
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {data?.teacherName}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  background: "var(--bs-secondary-bg)",
                  border: "0.5px solid var(--bs-border-color)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  color: "var(--bs-secondary-color)",
                }}
              >
                #{data?.courseId ?? courseId}
              </span>
            </div>
          </div>
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label for="Title">{t("CourseTitle")}</Label>
                <Controller
                  name="Title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="Title"
                      placeholder={t("CourseTitle")}
                      invalid={!!errors.Title}
                      {...field}
                    />
                  )}
                />
                {errors.Title && (
                  <FormFeedback>{t(errors.Title.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="MiniDescribe">
                  {t("CourseMiniDescribe")}
                </Label>
                <Controller
                  name="MiniDescribe"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="MiniDescribe"
                      placeholder={t("CourseMiniDescribe")}
                      invalid={!!errors.MiniDescribe}
                      {...field}
                    />
                  )}
                />
                {errors.MiniDescribe && (
                  <FormFeedback>{t(errors.MiniDescribe.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="12" className="mb-1">
                <Label className="form-label" for="Describe">
                  {t("CourseDescribe")}
                </Label>
                <Controller
                  name="Describe"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="Describe"
                        type="textarea"
                        placeholder={t("CourseDescribe")}
                        invalid={!!errors.Describe}
                        {...field}
                      />
                      {errors.Describe && (
                        <FormFeedback>
                          {t(errors.Describe.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="imageAddress">
                  {t("CourseImageAddress")}
                </Label>
                <Controller
                  name="imageAddress"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="imageAddress"
                        placeholder={t("CourseImageAddress")}
                        invalid={!!errors.imageAddress}
                        {...field}
                      />
                      {errors.imageAddress && (
                        <div className="invalid-feedback d-block">
                          {t(errors.imageAddress.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="TumbImageAddress">
                  {t("CourseTumbImageAddress")}
                </Label>
                <Controller
                  name="TumbImageAddress"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="TumbImageAddress"
                        placeholder={t("CourseTumbImageAddress")}
                        invalid={!!errors.TumbImageAddress}
                        {...field}
                      />
                      {errors.TumbImageAddress && (
                        <FormFeedback>
                          {t(errors.TumbImageAddress.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="Capacity">
                  {t("CourseCapacity")}
                </Label>
                <Controller
                  name="Capacity"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputGroup className="input-group-merge">
                        <Cleave
                          className={`form-control ${
                            errors.Capacity ? "is-invalid" : ""
                          }`}
                          placeholder={t("CourseCapacity")}
                          options={options}
                          id="Capacity"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                      {errors.Capacity && (
                        <div className="invalid-feedback d-block">
                          {t(errors.Capacity.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="SessionNumber">
                  {t("CourseSessionNumber")}
                </Label>
                <Controller
                  name="SessionNumber"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputGroup className="input-group-merge">
                        <Cleave
                          className={`form-control ${
                            errors.SessionNumber ? "is-invalid" : ""
                          }`}
                          placeholder={t("CourseSessionNumber")}
                          options={options}
                          id="SessionNumber"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                      {errors.SessionNumber && (
                        <div className="invalid-feedback d-block">
                          {t(errors.SessionNumber.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="GoogleSchema">
                  {t("CourseGoogleSchema")}
                </Label>
                <Controller
                  name="GoogleSchema"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="GoogleSchema"
                        placeholder={t("CourseGoogleSchema")}
                        invalid={!!errors.GoogleSchema}
                        {...field}
                      />
                      {errors.GoogleSchema && (
                        <FormFeedback>
                          {t(errors.GoogleSchema.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="GoogleTitle">
                  {t("CourseGoogleTitle")}
                </Label>
                <Controller
                  name="GoogleTitle"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="GoogleTitle"
                        placeholder={t("CourseGoogleTitle")}
                        invalid={!!errors.GoogleTitle}
                        {...field}
                      />
                      {errors.GoogleTitle && (
                        <div className="invalid-feedback d-block">
                          {t(errors.GoogleTitle.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="Cost">
                  {t("CourseCost")}
                </Label>
                <Controller
                  name="Cost"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputGroup className="input-group-merge">
                        <Cleave
                          className={`form-control ${
                            errors.Cost ? "is-invalid" : ""
                          }`}
                          placeholder={t("CourseCost")}
                          options={options}
                          id="Cost"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                      {errors.Cost && (
                        <div className="invalid-feedback d-block">
                          {t(errors.Cost.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="UniqeUrlString">
                  {t("CourseUniqeUrlString")}
                </Label>
                <Controller
                  name="UniqeUrlString"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="UniqeUrlString"
                        placeholder={t("CourseUniqeUrlString")}
                        invalid={!!errors.UniqeUrlString}
                        {...field}
                      />
                      {errors.UniqeUrlString && (
                        <div className="invalid-feedback d-block">
                          {t(errors.UniqeUrlString.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="ShortLink">
                  {t("CourseShortLink")}
                </Label>
                <Controller
                  name="ShortLink"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="ShortLink"
                        placeholder={t("CourseShortLink")}
                        invalid={!!errors.ShortLink}
                        {...field}
                      />
                      {errors.ShortLink && (
                        <div className="invalid-feedback d-block">
                          {t(errors.ShortLink.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="CurrentCoursePaymentNumber">
                  {t("CourseCurrentPaymentNumber")}
                </Label>
                <Controller
                  name="CurrentCoursePaymentNumber"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputGroup className="input-group-merge">
                        <Cleave
                          className={`form-control ${
                            errors.CurrentCoursePaymentNumber
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder={t("CourseCurrentPaymentNumber")}
                          options={options}
                          id="CurrentCoursePaymentNumber"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                      {errors.CurrentCoursePaymentNumber && (
                        <div className="invalid-feedback d-block">
                          {t(errors.CurrentCoursePaymentNumber.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="CoursePrerequisiteId">
                  {t("CoursePrerequisiteId")}
                </Label>
                <Controller
                  name="CoursePrerequisiteId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputGroup className="input-group-merge">
                        <Cleave
                          className={`form-control ${
                            errors.CoursePrerequisiteId ? "is-invalid" : ""
                          }`}
                          placeholder={t("CoursePrerequisiteId")}
                          options={options}
                          id="CoursePrerequisiteId"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                      {errors.CoursePrerequisiteId && (
                        <div className="invalid-feedback d-block">
                          {t(errors.CoursePrerequisiteId.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="StartTime">
                  {t("CourseStartTime")}
                </Label>
                <Controller
                  name="StartTime"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        id="StartTime"
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-center"
                        value={field.value ? new Date(field.value) : null}
                        editable={false}
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date.toDate().toISOString());
                          } else {
                            field.onChange(null);
                          }
                        }}
                        placeholder="mm/dd/yyyy"
                        inputClass={`form-control ${
                          errors.StartTime ? "is-invalid" : ""
                        }`}
                        containerStyle={{ width: "100%" }}
                      />
                      {errors.StartTime && (
                        <div className="invalid-feedback d-block">
                          {t(errors.StartTime.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="EndTime">
                  {t("CourseEndTime")}
                </Label>
                <Controller
                  name="EndTime"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        id="EndTime"
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-center"
                        value={field.value ? new Date(field.value) : null}
                        editable={false}
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date.toDate().toISOString());
                          } else {
                            field.onChange(null);
                          }
                        }}
                        placeholder="mm/dd/yyyy"
                        inputClass={`form-control ${
                          errors.EndTime ? "is-invalid" : ""
                        }`}
                        containerStyle={{ width: "100%" }}
                      />
                      {errors.EndTime && (
                        <div className="invalid-feedback d-block">
                          {t(errors.EndTime.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label for="CourseLvlId">{t("CourseLvlId")}</Label>
                <Controller
                  name="CourseLvlId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className={`react-select ${
                        errors.CourseLvlId ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={levelsList}
                      value={currentLevel}
                      id="CourseLvlId"
                      name="CourseLvlId"
                      onChange={(data) => {
                        setCurrentLevel(data);
                        setValue("CourseLvlId", data.value);
                      }}
                    />
                  )}
                />
                {errors.CourseLvlId && (
                  <div className="invalid-feedback d-block">
                    {t(errors.CourseLvlId.message)}
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label for="CourseStatusId">{t("CourseStatusId")}</Label>
                <Controller
                  name="CourseStatusId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className={`react-select ${
                        errors.CourseStatusId ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={statusList}
                      value={currentStatus}
                      id="CourseStatusId"
                      name="CourseStatusId"
                      onChange={(data) => {
                        setCurrentStatus(data);
                        setValue("CourseStatusId", data.value);
                      }}
                    />
                  )}
                />
                {errors.CourseStatusId && (
                  <div className="invalid-feedback d-block">
                    {t(errors.CourseStatusId.message)}
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label for="TeacherId">{t("CourseTeacherId")}</Label>
                <Controller
                  name="TeacherId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className={`react-select ${
                        errors.TeacherId ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={teachersList}
                      value={currentTeacher}
                      id="TeacherId"
                      name="TeacherId"
                      onChange={(data) => {
                        setCurrentTeacher(data);
                        setValue("TeacherId", data.value);
                      }}
                    />
                  )}
                />
                {errors.TeacherId && (
                  <div className="invalid-feedback d-block">
                    {t(errors.TeacherId.message)}
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label for="CourseTypeId">{t("CourseTypeId")}</Label>
                <Controller
                  name="CourseTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className={`react-select ${
                        errors.CourseTypeId ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={typesList}
                      value={currentTypes}
                      placeholder={t("CourseTypeId")}
                      id="CourseTypeId"
                      name="CourseTypeId"
                      onChange={(data) => {
                        setCurrentTypes(data);
                        setValue("CourseTypeId", data.value);
                      }}
                    />
                  )}
                />
                {errors.CourseTypeId && (
                  <div className="invalid-feedback d-block">
                    {t(errors.CourseTypeId.message)}
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label for="TremId">{t("CourseTremId")}</Label>
                <Controller
                  name="TremId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className={`react-select ${
                        errors.TremId ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={termsList}
                      value={currentTerms}
                      placeholder={t("CourseTremId")}
                      id="TremId"
                      name="TremId"
                      onChange={(data) => {
                        setCurrentTerms(data);
                        setValue("TremId", data.value);
                      }}
                    />
                  )}
                />
                {errors.TremId && (
                  <div className="invalid-feedback d-block">
                    {t(errors.TremId.message)}
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label for="ClassId">{t("CourseClassId")}</Label>
                <Controller
                  name="ClassId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className={`react-select ${
                        errors.ClassId ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={classRoomsList}
                      value={currentClassRoom}
                      placeholder={t("CourseClassId")}
                      id="ClassId"
                      name="ClassId"
                      onChange={(data) => {
                        setCurrentClassRoom(data);
                        setValue("ClassId", data.value);
                      }}
                    />
                  )}
                />
                {errors.ClassId && (
                  <div className="invalid-feedback d-block">
                    {t(errors.ClassId.message)}
                  </div>
                )}
              </Col>
              <Col style={{ marginTop: "200px" }} sm="12">
                <Button type="submit" className="me-1" color="primary">
                  {t("SaveChanges")}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default AccountSetting;
