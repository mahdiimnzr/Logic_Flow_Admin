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
import { postCourseLevel } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const defaultValues = {
  levelName: "",
};

const validationSchema = Yup.object({
  levelName: Yup.string().required("LevelNameRequired"),
});

const LevelSideBar = ({ open, toggleSidebar }) => {
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

  const { mutate: postCourseLevels } = useMutation({
    mutationFn: postCourseLevel,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success(response.data.message || t("LevelCreated"), { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["CourseLevel"] });
      toggleSidebar();
      
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    postCourseLevels(data);
  };

  const handleSidebarClosed = () => {
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, defaultValues[key]);
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={t("NewLevel")}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="levelName">
            {t("LevelName")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="levelName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="levelName"
                  placeholder={t("LevelName")}
                  invalid={!!errors.levelName}
                  {...field}
                />
                {errors.levelName && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.levelName.message)}
                  </span>
                )}
              </>
            )}
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

export default LevelSideBar;