import { useState } from "react";
import Sidebar from "@components/sidebar";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Label,
  FormText,
  Form,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";
import "cleave.js/dist/addons/cleave-phone.ir";
import Cleave from "cleave.js/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const defaultValues = {
  lastName: "",
  firstName: "",
  gmail: "",
  password: "",
  phoneNumber: "",
  isStudent: false,
  isTeacher: false,
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("FirstNameRequired"),
  lastName: Yup.string().required("LastNameRequired"),
  gmail: Yup.string().email("EmailInvalid").required("EmailRequired"),
  password: Yup.string().min(8, "PasswordMin").required("PasswordRequired"),
  phoneNumber: Yup.string()
    .length(11, "PhoneNumberLength")
    .required("PhoneNumberRequired"),
  isStudent: Yup.boolean(),
  isTeacher: Yup.boolean(),
});

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const options = { phone: true, phoneRegionCode: "IR" };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  // const { mutate: createUserMutate } = useMutation({
  //   mutationFn: createUser,
  //   onMutate: () => {
  //     const toastId = toast.loading(t("Loading"));
  //     return { toastId };
  //   },
  //   onSuccess: (response, _, context) => {
  //     if (response.data.success) {
  //       toast.success(response.data.message, { id: context.toastId });
  //       queryClient.invalidateQueries({ queryKey: ["UsersList"] });
  //       toggleSidebar();
  //     } else {
  //       toast.error(response.data.message, { id: context.toastId });
  //     }
  //   },
  //   onError: (response, _, context) => {
  //     toast.error(response.data.message, { id: context.toastId });
  //   },
  // });

  const onSubmit = (data) => {
    // createUserMutate(data);
  };

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, defaultValues[key]);
    }
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={t("NewUser")}
      headerClassName="mb-1 flex justify-between"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="firstName">
            {t("FName")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="firstName"
                  placeholder={t("FName")}
                  invalid={!!errors.firstName}
                  {...field}
                />
                {errors.firstName && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.firstName.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="lastName">
            {t("LName")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="lastName"
                  placeholder={t("LName")}
                  invalid={!!errors.lastName}
                  {...field}
                />
                {errors.lastName && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.lastName.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="gmail">
            {t("Email")} <span className="text-danger">*</span>
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
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.gmail.message)}
                  </span>
                )}
              </>
            )}
          />
          <FormText color="muted">{t("EmailPeriods")}</FormText>
        </div>
        <div className="mb-1">
          <Label className="form-label" for="password">
            {t("Password")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <>
                <InputPasswordToggle
                  placeholder={t("Password")}
                  invalid={!!errors.password}
                  id="password"
                  htmlFor="password"
                  {...field}
                />
                {errors.password && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.password.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="phoneNumber">
            {t("PhoneNumber")} <span className="text-danger">*</span>
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
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.phoneNumber.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div className="d-flex gap-1 mb-1">
          <Controller
            name="isStudent"
            control={control}
            render={({ field }) => (
              <Input
                type="checkbox"
                id="isStudent"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Label className="form-label" for="isStudent">
            {t("isStudent")}
          </Label>
        </div>
        <div className="d-flex gap-1 mb-1">
          <Controller
            name="isTeacher"
            control={control}
            render={({ field }) => (
              <Input
                type="checkbox"
                id="isTeacher"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Label className="form-label" for="isTeacher">
            {t("isTeacher")}
          </Label>
        </div>
        <Button type="submit" className="me-1" color="primary">
          {t("Submit")}
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          {t("Cancel")}
        </Button>
      </Form>
    </Sidebar>
  );
};

export default SidebarNewUsers;
