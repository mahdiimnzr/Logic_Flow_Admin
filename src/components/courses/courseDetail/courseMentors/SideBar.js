import { useForm, Controller } from "react-hook-form";
import { Button, Label, Form } from "reactstrap";
import Select from "react-select";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { addCourseAssistance } from "../../../../core/services/api/CourseList/courseList.service";
import Sidebar from "@components/sidebar";
import { useState, useMemo } from "react";

const validationSchema = Yup.object({
  userId: Yup.number().typeError("UserIdRequired").required("UserIdRequired"),
});

const SidebarNewMentor = ({ open, toggleSidebar }) => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const usersData = queryClient.getQueryState([
    "UsersList",
    { RowsOfPage: 1000 },
  ]);

  const [currentUser, setCurrentUser] = useState({
    value: null,
    label: t("UsersSelection"),
  });

  const userOptions = useMemo(
    () =>
      (usersData?.data?.data?.listUser ?? []).map((user) => ({
        value: user.id,
        label: user.fName + " " + user.lName,
      })),
    [usersData],
  );

  const defaultValues = {
    userId: null,
    courseId: courseId,
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const { mutate: createMentorMutate } = useMutation({
    mutationFn: addCourseAssistance,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({ queryKey: ["CourseAssistance"] });
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
    createMentorMutate(data);
  };

  const handleSidebarClosed = () => {
    setValue("userId", null);
    setValue("courseId", courseId);
    setCurrentUser({
      value: null,
      label: t("UsersSelection"),
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={t("NewMentor")}
      headerClassName="mb-1 flex justify-between"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="userId">
            {t("SelectUser")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Select
                name="userId"
                id="userId"
                options={userOptions}
                placeholder={t("UsersSelection")}
                classNamePrefix="select"
                className={`react-select ${errors.userId ? "is-invalid" : ""}`}
                value={currentUser}
                onChange={(selected) => {
                  setCurrentUser(selected);
                  field.onChange(selected.value);
                }}
              />
            )}
          />
          {errors.userId && (
            <span className="text-danger" style={{ fontSize: "12px" }}>
              {t(errors.userId.message)}
            </span>
          )}
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

export default SidebarNewMentor;
