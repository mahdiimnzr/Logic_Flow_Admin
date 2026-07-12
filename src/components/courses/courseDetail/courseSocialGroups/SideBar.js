import Sidebar from "@components/sidebar";
import { useForm, Controller } from "react-hook-form";
import { Button, Label, Form, Input } from "reactstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { addCourseSocialGroup } from "../../../../core/services/api/CourseList/courseList.service";

const defaultValues = {
  groupName: "",
  groupLink: "",
  courseId: "",
};

const validationSchema = Yup.object({
  groupName: Yup.string().trim().required("SocialGroupNameRequired"),
  groupLink: Yup.string()
    .url("SocialGroupLinkInvalid")
    .trim()
    .required("SocialGroupLinkRequired"),
});

const SidebarNewSocialGroup = ({ open, toggleSidebar }) => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...defaultValues, courseId },
    resolver: yupResolver(validationSchema),
  });

  const { mutate: createSocialGroupMutate } = useMutation({
    mutationFn: addCourseSocialGroup,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({ queryKey: ["CourseSocialGroups"] });
        toggleSidebar();
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    createSocialGroupMutate(data);
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
      title={t("NewSocialGroup")}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="groupName">
            {t("SocialGroupName")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="groupName"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="groupName"
                  placeholder={t("SocialGroupNamePlaceholder")}
                  invalid={!!errors.groupName}
                  {...field}
                />
                {errors.groupName && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.groupName.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="groupLink">
            {t("SocialGroupLink")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="groupLink"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  id="groupLink"
                  placeholder={t("SocialGroupLinkPlaceholder")}
                  invalid={!!errors.groupLink}
                  {...field}
                />
                {errors.groupLink && (
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    {t(errors.groupLink.message)}
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

export default SidebarNewSocialGroup;