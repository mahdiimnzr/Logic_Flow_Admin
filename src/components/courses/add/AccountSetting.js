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

// import ImageFallBack from "../common/ImageFallback";
import profile from "/public/Profile.png";

import { selectThemeColors } from "@utils";
import { useTranslation } from "react-i18next";
// import formatDate from "../../core/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
// import { updateUserDetail } from "../../core/services/api/Users/users.service";

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
      data?.roles.some((role) => role.roleName.includes("teacher")) ?? false
    );
  }, [data]);

  const checkIsStudent = useMemo(() => {
    return (
      data?.roles.some((role) => role.roleName.includes("student")) ?? false
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

  // const { mutate: updateUserMutate } = useMutation({
  //   mutationFn: updateUserDetail,
  //   onMutate: () => {
  //     const toastId = toast.loading(t("Loading"));
  //     return { toastId };
  //   },
  //   onSuccess: (response, _, context) => {
  //     if (response.data.success) {
  //       toast.success(response.data.message, { id: context.toastId });
  //       queryClient.invalidateQueries({ queryKey: [`UserDetail-${userId}`] });
  //     } else {
  //       toast.error(response.data.message, { id: context.toastId });
  //     }
  //   },
  //   onError: (response, _, context) => {
  //     toast.error(response.data.message, { id: context.toastId });
  //   },
  // });

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
          <CardTitle tag="h4">مشخصات کاربری</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex align-items-center gap-3">
            {/* <div className="me-25">
              <ImageFallBack
                className="rounded me-50"
                src={data?.currentPictureAddress}
                fallback={profile}
                alt="Generic placeholder image"
                height="100"
                width="100"
              />
            </div> */}
            {/* <div className="d-flex flex-column gap-1">
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
            </div> */}
          </div>
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="5" className="mb-1">
                <Label className="form-label" for="fName">
                  نام دوره :
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={"نام دوره را وارد کنید"}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="5" className="mb-1">
                <Label className="form-label" for="fName">
                  قیمت دوره :
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={"قیمت دوره را وارد کنید"}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="5" className="mb-1">
                <Label className="form-label" for="fName">
                  ظرفیت دوره :
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={" ظرفیت دوره را وارد کنید"}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="5" className="mb-1">
                <Label className="form-label" for="fName">
                  تعداد جلسات دوره :
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={"تعداد جلسات دوره را وارد کنید"}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
              </Col>

              <Col sm="10" className="mb-1">
                <Label className="form-label" for="fName">
                  توضیات مختصر درباره دوره :
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={"توضیات مخصر را وارد کنید"}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="5" className="mb-1">
                <Label className="form-label" for="fName">
                  شروع دوره :
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={""}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
              </Col>
              <Col sm="5" className="mb-1">
                <Label className="form-label" for="fName">
                  پایان دوره :
                </Label>
                <Controller
                  name="fName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fName"
                      placeholder={""}
                      invalid={!!errors.fName}
                      {...field}
                    />
                  )}
                />
                {errors.fName && (
                  <FormFeedback>{t(errors.fName.message)}</FormFeedback>
                )}
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
