import Sidebar from "@components/sidebar";
import { useForm, Controller } from "react-hook-form";
import { Button, Label, Form, Input } from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";
import "cleave.js/dist/addons/cleave-phone.ir";
import Cleave from "cleave.js/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { postStatus } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const defaultValues = {
  statusName: "",
};

const validationSchema = Yup.object({
  statusName: Yup.string().required("نام الزامی است"),
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

  const { mutate: postStatusMutation } = useMutation({
    mutationFn: postStatus,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success("تکنولوژی با موفقیت ساخته شد", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["Status"] });
      toggleSidebar();
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    postStatusMutation(data);
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
          <Label className="form-label" for="statusName">
            نام وضعبت<span className="text-danger">*</span>
          </Label>
          <Controller
            name="statusName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="statusName"
                  placeholder={" نام وضعبت"}
                  invalid={!!errors.statusName}
                  {...field}
                />
                {errors.statusName && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.statusName.message)}
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
