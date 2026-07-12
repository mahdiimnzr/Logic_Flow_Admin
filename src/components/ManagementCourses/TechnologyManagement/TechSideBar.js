import { useState } from "react";
import Sidebar from "@components/sidebar";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Label,
  Form,
  Input,
} from "reactstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ImageDropZone from "../../common/ImageDropZone";
import { postTechnology } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const defaultValues = {
  techName: "",
  describe: "",
  iconAddress: "",
};

const validationSchema = Yup.object({
  techName: Yup.string().required("TechNameRequired"),
  describe: Yup.string().required("TechDescribeRequired"),
  iconAddress: Yup.string().required("IconRequired"),
});

const TechSideBar = ({ open, toggleSidebar }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { mutate: postTechnologyMutate } = useMutation({
    mutationFn: postTechnology,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success(response.data.message || t("TechnologyCreated"), { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["Technology"] });
      toggleSidebar();
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    postTechnologyMutate(data);
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
      title={t("NewTechnology")}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="techName">
            {t("TechName")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="techName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="techName"
                  placeholder={t("TechName")}
                  invalid={!!errors.techName}
                  {...field}
                />
                {errors.techName && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.techName.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="describe">
            {t("TechDescribe")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="describe"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="describe"
                  placeholder={t("TechDescribe")}
                  invalid={!!errors.describe}
                  {...field}
                />
                {errors.describe && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.describe.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className="mb-1">
          <ImageDropZone
            error={errors.iconAddress ? t(errors.iconAddress.message) : null}
            onChange={(files) => {
              if (files.length > 0) {
                setValue("iconAddress", URL.createObjectURL(files[0]), { shouldValidate: true });
              } else {
                setValue("iconAddress", "", { shouldValidate: true });
              }
            }}
          />
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

export default TechSideBar;