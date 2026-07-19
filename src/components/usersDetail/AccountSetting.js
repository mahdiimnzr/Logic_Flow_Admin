import { Fragment, useMemo, useState } from "react";

import Select from "react-select";
import Cleave from "cleave.js/react";
import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.ir";
import InputPasswordToggle from "@components/input-password-toggle";
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

import ImageFallBack from "../common/ImageFallback";
import profile from "/public/Profile.png";

import { selectThemeColors } from "@utils";
import { useTranslation } from "react-i18next";
import formatDate from "../../core/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { updateUserDetail } from "../../core/services/api/Users/users.service";

const validationSchema = Yup.object({
  fName: Yup.string().required("FirstNameRequired"),
  lName: Yup.string().required("LastNameRequired"),
  gmail: Yup.string().email("EmailInvalid").required("EmailRequired"),
  phoneNumber: Yup.string()
    .length(11, "PhoneNumberLength")
    .required("PhoneNumberRequired"),
  recoveryEmail: Yup.string()
    .email("EmailInvalid")
    .required("RecoveryEmailRequired"),
  userAbout: Yup.string().required("UserAboutRequired"),
  telegramLink: Yup.string().required("TelegramLinkRequired"),
  linkdinProfile: Yup.string().required("LinkedinRequired"),
  nationalCode: Yup.string()
    .length(10, "NationalCodeLength")
    .required("NationalCodeRequired"),
  homeAdderess: Yup.string().required("HomeAddressRequired"),
  birthDay: Yup.string()
    .nullable()
    .required("BirthDayRequired")
    .test("is-valid-date", "BirthDayInvalid", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
});

const AccountSetting = ({ data }) => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const checkIsTeacher = useMemo(() => {
    return (
      data?.roles?.some((role) => role.roleName.includes("teacher")) ?? false
    );
  }, [data]);

  const checkIsStudent = useMemo(() => {
    return (
      data?.roles?.some((role) => role.roleName.includes("student")) ?? false
    );
  }, [data]);

  const options = { phone: true, phoneRegionCode: "IR" };
  const nationalCodeOptions = {
    blocks: [3, 6, 1],
    delimiter: "-",
    numericOnly: true,
  };

  const defaultValues = {
    id: userId,
    fName: data?.fName ?? "",
    lName: data?.lName ?? "",
    userName: data?.userName ?? "",
    gmail: data?.gmail ?? "",
    phoneNumber:
      data?.phoneNumber?.[0] == "0"
        ? data?.phoneNumber
        : "0" + (data?.phoneNumber ?? ""),
    recoveryEmail: data?.recoveryEmail ?? "",
    active: data?.active ?? false,
    isDelete: data?.isDelete ?? false,
    userAbout: data?.userAbout ?? "",
    isTecher: checkIsTeacher ?? false,
    isStudent: checkIsStudent ?? false,
    linkdinProfile: data?.linkdinProfile ?? "",
    telegramLink: data?.telegramLink ?? "",
    nationalCode: data?.nationalCode ?? "",
    twoStepAuth: data?.twoStepAuth ?? false,
    homeAdderess: data?.homeAdderess ?? "",
    receiveMessageEvent: data?.receiveMessageEvent ?? false,
    gender: data?.gender ?? false,
    insertDate: data?.insertDate ?? "",
    birthDay: data?.birthDay ?? null,
    password: data?.password ?? "",
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const { mutate: updateUserMutate } = useMutation({
    mutationFn: updateUserDetail,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({ queryKey: [`UserDetail-${userId}`] });
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const [avatar, setAvatar] = useState(data?.avatar ?? "");
  const [currentStatus, setCurrentStatus] = useState({
    value: data?.active,
    label: data?.active ? t("Active") : t("DeActive"),
  });
  const [currentIsDelete, setCurrentIsDelete] = useState({
    value: data?.isDelete,
    label: data?.isDelete ? t("Deleted") : t("NotDeleted"),
  });
  const [currentIsTeacher, setCurrentIsTeacher] = useState({
    value: checkIsTeacher,
    label: checkIsTeacher ? t("isTeacher") : t("isNotTeacher"),
  });
  const [currentIsStudent, setCurrentIsStudent] = useState({
    value: checkIsStudent,
    label: checkIsStudent ? t("isStudent") : t("isNotStudent"),
  });
  const [currentTwoStep, setCurrentTwoStep] = useState({
    value: data?.twoStepAuth,
    label: data?.twoStepAuth ? t("Active") : t("DeActive"),
  });
  const [currentMessageEvent, setCurrentMessageEvent] = useState({
    value: data?.receiveMessageEvent,
    label: data?.receiveMessageEvent ? t("Active") : t("DeActive"),
  });
  const [currentGender, setCurrentGender] = useState({
    value: data?.gender,
    label: data?.gender ? t("Man") : t("Woman"),
  });

  const statusOptions = [
    { value: "active", label: t("Active") },
    { value: "deActive", label: t("DeActive") },
  ];
  const deleteOptions = [
    { value: "delete", label: t("Deleted") },
    { value: "notDeleted", label: t("NotDeleted") },
  ];
  const teacherOptions = [
    { value: "teacher", label: t("isTeacher") },
    { value: "notTeacher", label: t("isNotTeacher") },
  ];
  const studentOptions = [
    { value: "student", label: t("isStudent") },
    { value: "notStudent", label: t("isNotStudent") },
  ];
  const genderOptions = [
    { value: "man", label: t("Man") },
    { value: "woman", label: t("Woman") },
  ];

  const onSubmit = (data) => {
    updateUserMutate(data);
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("ProfileDetails")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex align-items-center gap-3">
            <div className="me-25">
              <ImageFallBack
                className="rounded me-50"
                src={data?.currentPictureAddress}
                fallback={profile}
                alt="Generic placeholder image"
                height="100"
                width="100"
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                  {data?.fName} {data?.lName}
                </span>
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
                  #{data?.id ?? userId}
                </span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {data?.roles?.map((value, index) => {
                  const colors = [
                    { bg: "rgba(115, 103, 240, 0.16)", color: "#7367f0" },
                    { bg: "rgba(40, 199, 111, 0.16)", color: "#28c76f" },
                    { bg: "rgba(0, 207, 232, 0.16)", color: "#00cfe8" },
                    { bg: "rgba(255, 159, 67, 0.16)", color: "#ff9f43" },
                  ];
                  const c = colors[index % colors.length];
                  return (
                    <span
                      key={index}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 500,
                        background: c.bg,
                        color: c.color,
                        borderRadius: 999,
                        padding: "3px 10px",
                      }}
                    >
                      {value.roleName}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="fName">
                  {t("FName")}
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={t("FName")}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="lName">
                  {t("LName")}
                </Label>
                <Controller
                  name="lName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="lName"
                      placeholder={t("LName")}
                      invalid={!!errors.lName}
                      {...field}
                    />
                  )}
                />
                {errors.lName && (
                  <FormFeedback>{t(errors.lName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="gmail">
                  {t("Email")}
                </Label>
                <Controller
                  name="gmail"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="email"
                        id="gmail"
                        placeholder={t("Email")}
                        invalid={!!errors.gmail}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          setValue("userName", event.target.value);
                        }}
                      />
                      {errors.gmail && (
                        <FormFeedback>{t(errors.gmail.message)}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="phoneNumber">
                  {t("PhoneNumber")}
                </Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputGroup className="input-group-merge">
                        <Cleave
                          dir="ltr"
                          className={`form-control ${
                            errors.phoneNumber ? "is-invalid" : ""
                          }`}
                          placeholder="0912 912 9192"
                          options={options}
                          id="phoneNumber"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                      {errors.phoneNumber && (
                        <div className="invalid-feedback d-block">
                          {t(errors.phoneNumber.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="recoveryEmail">
                  {t("RecoveryEmail")}
                </Label>
                <Controller
                  name="recoveryEmail"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="email"
                        id="recoveryEmail"
                        placeholder={t("RecoveryEmail")}
                        invalid={!!errors.recoveryEmail}
                        {...field}
                      />
                      {errors.recoveryEmail && (
                        <FormFeedback>
                          {t(errors.recoveryEmail.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="userAbout">
                  {t("UserAbout")}
                </Label>
                <Controller
                  name="userAbout"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="userAbout"
                        placeholder={t("UserAbout")}
                        invalid={!!errors.userAbout}
                        {...field}
                      />
                      {errors.userAbout && (
                        <FormFeedback>
                          {t(errors.userAbout.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="telegramLink">
                  {t("TelegramLink")}
                </Label>
                <Controller
                  name="telegramLink"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="telegramLink"
                        placeholder={t("TelegramLink")}
                        invalid={!!errors.telegramLink}
                        {...field}
                      />
                      {errors.telegramLink && (
                        <FormFeedback>
                          {t(errors.telegramLink.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="homeAdderess">
                  {t("HomeAddress")}
                </Label>
                <Controller
                  name="homeAdderess"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="homeAdderess"
                        placeholder={t("HomeAddress")}
                        invalid={!!errors.homeAdderess}
                        {...field}
                      />
                      {errors.homeAdderess && (
                        <FormFeedback>
                          {t(errors.homeAdderess.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="nationalCode">
                  {t("NationalCode")}
                </Label>
                <Controller
                  name="nationalCode"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputGroup className="input-group-merge">
                        <Cleave
                          dir="ltr"
                          className={`form-control ${
                            errors.nationalCode ? "is-invalid" : ""
                          }`}
                          placeholder="200-202020-2"
                          options={nationalCodeOptions}
                          id="nationalCode"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.rawValue)}
                        />
                      </InputGroup>
                      {errors.nationalCode && (
                        <div className="invalid-feedback d-block">
                          {t(errors.nationalCode.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="linkdinProfile">
                  {t("LinkedinProfile")}
                </Label>
                <Controller
                  name="linkdinProfile"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="linkdinProfile"
                        placeholder={t("LinkedinProfile")}
                        invalid={!!errors.linkdinProfile}
                        {...field}
                      />
                      {errors.linkdinProfile && (
                        <FormFeedback>
                          {t(errors.linkdinProfile.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label for="active">{t("Status")}</Label>
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      options={statusOptions}
                      value={currentStatus}
                      id="active"
                      name="active"
                      onChange={(data) => {
                        const value = data.value === "active";
                        setCurrentStatus(data);
                        setValue("active", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label for="isDelete">{t("isDelete")}</Label>
                <Controller
                  name="isDelete"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      options={deleteOptions}
                      value={currentIsDelete}
                      id="isDelete"
                      name="isDelete"
                      onChange={(data) => {
                        const value = data.value === "delete";
                        setCurrentIsDelete(data);
                        setValue("isDelete", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label for="isTecher">{t("Teacher")}</Label>
                <Controller
                  name="isTecher"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      options={teacherOptions}
                      value={currentIsTeacher}
                      id="isTecher"
                      name="isTecher"
                      onChange={(data) => {
                        const value = data.value === "teacher";
                        setCurrentIsTeacher(data);
                        setValue("isTecher", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label for="isStudent">{t("Student")}</Label>
                <Controller
                  name="isStudent"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      options={studentOptions}
                      value={currentIsStudent}
                      id="isStudent"
                      name="isStudent"
                      onChange={(data) => {
                        const value = data.value === "student";
                        setCurrentIsStudent(data);
                        setValue("isStudent", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label for="twoStepAuth">{t("TwoStep")}</Label>
                <Controller
                  name="twoStepAuth"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      options={statusOptions}
                      value={currentTwoStep}
                      id="twoStepAuth"
                      name="twoStepAuth"
                      onChange={(data) => {
                        const value = data.value === "active";
                        setCurrentTwoStep(data);
                        setValue("twoStepAuth", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label for="receiveMessageEvent">
                  {t("ReceiveMessageEvent")}
                </Label>
                <Controller
                  name="receiveMessageEvent"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      options={statusOptions}
                      value={currentMessageEvent}
                      id="receiveMessageEvent"
                      name="receiveMessageEvent"
                      onChange={(data) => {
                        const value = data.value === "active";
                        setCurrentMessageEvent(data);
                        setValue("receiveMessageEvent", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label for="gender">{t("Gender")}</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      classNamePrefix="select"
                      options={genderOptions}
                      value={currentGender}
                      id="gender"
                      name="gender"
                      onChange={(data) => {
                        const value = data.value === "man";
                        setCurrentGender(data);
                        setValue("gender", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="birthDay">
                  {t("BirthDay")}
                </Label>
                <Controller
                  name="birthDay"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        id="birthDay"
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-right"
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
                          errors.birthDay ? "is-invalid" : ""
                        }`}
                        containerStyle={{ width: "100%" }}
                      />
                      {errors.birthDay && (
                        <div className="invalid-feedback d-block">
                          {t(errors.birthDay.message)}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="insertDate">
                  {t("InsertDate")}
                </Label>
                <Controller
                  name="insertDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="insertDate"
                      readOnly
                      value={formatDate(data?.insertDate ?? "")}
                    />
                  )}
                />
              </Col>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="password">
                  {t("Password")}
                </Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      placeholder={t("Password")}
                      invalid={!!errors.password}
                      defaultValue={data?.password ?? ""}
                      readOnly
                      id="password"
                      htmlFor="password"
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col className="mt-2" sm="12">
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
