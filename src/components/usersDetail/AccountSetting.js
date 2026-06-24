// ** React Imports
import { Fragment, useMemo, useState } from "react";

// ** Third Party Components
import Select from "react-select";
import Cleave from "cleave.js/react";
import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.ir";
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
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

// ** ImageFallBack
import ImageFallBack from "../common/ImageFallback";
import profile from "/public/Profile.png";

// ** Utils
import { selectThemeColors } from "@utils";
import { useTranslation } from "react-i18next";

const countryOptions = [
  { value: "uk", label: "UK" },
  { value: "usa", label: "USA" },
  { value: "france", label: "France" },
  { value: "russia", label: "Russia" },
  { value: "canada", label: "Canada" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "dutch", label: "Dutch" },
];

const AccountSetting = ({ data }) => {
  const { t } = useTranslation();

  const checkIsTeacher = useMemo(() => {
    return (
      data?.roles.some((role) => role.roleName.includes("teacher")) ?? false
    );
  }, [data]);
  const checkIsStudent = useMemo(() => {
    return (
      data?.roles.some((role) => role.roleName.includes("student")) ?? false
    );
  }, [data]);

  const options = { phone: true, phoneRegionCode: "IR" };

  // ** Hooks
  const defaultValues = {
    fName: data?.fName ?? "",
    lName: data?.lName ?? "",
    gmail: data?.gmail ?? "",
    phoneNumber:
      data?.phoneNumber[0] == 0
        ? data?.phoneNumber
        : 0 + data?.phoneNumber ?? "",
    recoveryEmail: data?.recoveryEmail ?? "",
    active: data?.active ?? false,
    isDelete: data?.isDelete ?? false,
    userAbout: data?.userAbout ?? "",
    isTecher: checkIsTeacher ?? false,
    isStudent: checkIsStudent ?? false,
    linkdinProfile: data?.linkdinProfile ?? "",
  };
  const {
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** States
  const [avatar, setAvatar] = useState(data?.avatar ? data?.avatar : "");
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

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleImgReset = () => {
    setAvatar("@src/assets/images/avatars/avatar-blank.png");
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Profile Details</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex">
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
            <div className="d-flex align-items-end mt-75 ms-1">
              <div>
                <Button
                  tag={Label}
                  className="mb-75 me-75"
                  size="sm"
                  color="primary"
                >
                  Upload
                  <Input
                    type="file"
                    onChange={onChange}
                    hidden
                    accept="image/*"
                  />
                </Button>
                <Button
                  className="mb-75"
                  color="secondary"
                  size="sm"
                  outline
                  onClick={handleImgReset}
                >
                  Reset
                </Button>
                <p className="mb-0">
                  Allowed JPG, GIF or PNG. Max size of 800kB
                </p>
              </div>
            </div>
          </div>
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="4" className="mb-1">
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
                      invalid={errors.fName && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.fName && (
                  <FormFeedback> {t(errors.fName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="4" className="mb-1">
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
                      invalid={errors.lName && true}
                      {...field}
                    />
                  )}
                />
                {errors.lName && (
                  <FormFeedback> {t(errors.lName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="4" className="mb-1">
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
                      />
                      {errors.gmail && (
                        <FormFeedback> {t(errors.gmail.message)}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="4" className="mb-1">
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
                        <FormFeedback>
                          {t(errors.phoneNumber.message)}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
              <Col sm="4" className="mb-1">
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
              <Col sm="4" className="mb-1">
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
                        const value = data.value === "active" ? true : false;
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
                        const value = data.value === "delete" ? true : false;
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
                        const value = data.value === "teacher" ? true : false;
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
                        const value = data.value === "student" ? true : false;
                        setCurrentIsStudent(data);
                        setValue("isStudent", value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="timeZone">
                  Timezone
                </Label>
                {/* <Select
                  id="timeZone"
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  options={timeZoneOptions}
                  theme={selectThemeColors}
                  defaultValue={timeZoneOptions[0]}
                /> */}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="currency">
                  Currency
                </Label>
                {/* <Select
                  id="currency"
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  options={currencyOptions}
                  theme={selectThemeColors}
                  defaultValue={currencyOptions[0]}
                /> */}
              </Col>
              <Col className="mt-2" sm="12">
                <Button type="submit" className="me-1" color="primary">
                  Save changes
                </Button>
                <Button color="secondary" outline>
                  Discard
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
