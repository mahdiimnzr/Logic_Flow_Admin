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
import ImageDropZone from "../../common/ImageDropZone";
import { postCourseLevel } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const defaultValues = {
  levelName: "",
};

const validationSchema = Yup.object({
  levelName: Yup.string().required("نام الزامی است"),
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

  const { mutate: postCourseLevels } = useMutation({
    mutationFn: postCourseLevel,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success("سطح دوره جدید ساخته شد", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["CourseLevel"] });
      toggleSidebar();
      
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    postCourseLevels(data);
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
      title={"تکنولوژی جدید"}
      headerClassName="mb-1 flex justify-between"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="levelName">
            نام سطح<span className="text-danger">*</span>
          </Label>
          <Controller
            name="levelName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="levelName"
                  placeholder={" ...نام سطح"}
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

export default SidebarNewUsers;
