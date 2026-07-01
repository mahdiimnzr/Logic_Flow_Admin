import { useState } from "react";
import Sidebar from "@components/sidebar";
import { useForm, Controller } from "react-hook-form";
import { Button, Label, Form, Input, InputGroup } from "reactstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { addCourseGroup } from "../../../../core/services/api/CourseList/courseList.service";
import formDataConverter from "../../../../core/utils/formDataConvertor";
import Cleave from "cleave.js/react";

const SidebarNewGroup = ({ open, toggleSidebar }) => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

  const defaultValues = {
    CourseId: courseId,
    GroupName: "",
    GroupCapacity: "",
  };

  const validationSchema = Yup.object({
    GroupName: Yup.string().required("CourseGroupNameRequired"),
    GroupCapacity: Yup.string().required("CourseGroupCapacityRequired"),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const { mutate: createGroupMutate } = useMutation({
    mutationFn: addCourseGroup,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`CourseGroup-${courseId}`],
        });
        toggleSidebar();
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
    createGroupMutate(formData);
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
      title={t("NewGroup")}
      headerClassName="mb-1 flex justify-between"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="GroupName">
            {t("CourseGroupName")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="GroupName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="GroupName"
                  placeholder={t("CourseGroupNamePlaceholder")}
                  invalid={!!errors.GroupName}
                  {...field}
                />
                {errors.GroupName && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.GroupName.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="GroupCapacity">
            {t("CourseGroupCapacity")}
          </Label>
          <Controller
            name="GroupCapacity"
            control={control}
            render={({ field }) => (
              <>
                <InputGroup className="input-group-merge">
                  <Cleave
                    className={`form-control ${
                      errors.GroupCapacity ? "is-invalid" : ""
                    }`}
                    placeholder={t("CourseGroupCapacity")}
                    options={options}
                    id="GroupCapacity"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                  />
                </InputGroup>
                {errors.GroupCapacity && (
                  <div className="invalid-feedback d-block">
                    {t(errors.GroupCapacity.message)}
                  </div>
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

export default SidebarNewGroup;
