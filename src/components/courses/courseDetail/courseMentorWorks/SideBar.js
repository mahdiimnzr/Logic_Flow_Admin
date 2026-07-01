import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Form, Input, FormFeedback } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { selectThemeColors } from "@utils";
import { addAssistanceWork } from "../../../../core/services/api/CourseList/courseList.service";
import Sidebar from "@components/sidebar";

const validationSchema = Yup.object({
  worktitle: Yup.string().required("WorkTitleRequired"),
  workDescribe: Yup.string().required("WorkDescribeRequired"),
  workDate: Yup.string().nullable().required("WorkDateRequired"),
  assistanceId: Yup.string().required("MentorRequired"),
});

const SidebarNewWork = ({ open, toggleSidebar, mentors }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mentorsList = mentors?.map((value) => {
    const mentor = { value: value.id, label: value.assistanceName };
    return mentor;
  });

  const [currentMentor, setCurrentMentor] = useState({
    value: null,
    label: t("SelectMentor"),
  });

  const defaultValues = {
    worktitle: "",
    workDescribe: "",
    workDate: null,
    assistanceId: "",
  };

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const { mutate: createWorkMutate } = useMutation({
    mutationFn: addAssistanceWork,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({ queryKey: ["AssistanceWork"] });
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
    createWorkMutate(data);
  };

  const handleSidebarClosed = () => {
    reset(defaultValues);
    setCurrentMentor({ value: null, label: t("SelectMentor") });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={t("NewWork")}
      headerClassName="mb-1 flex justify-between"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label for="assistanceId">{t("SelectMentor")}</Label>
          <Controller
            name="assistanceId"
            control={control}
            render={({ field }) => (
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className={`react-select ${
                  errors.assistanceId ? "is-invalid" : ""
                }`}
                classNamePrefix="select"
                options={mentorsList}
                value={currentMentor}
                placeholder={t("SelectMentor")}
                id="assistanceId"
                name="assistanceId"
                onChange={(data) => {
                  setCurrentMentor(data);
                  setValue("assistanceId", data.value);
                }}
              />
            )}
          />
          {errors.assistanceId && (
            <div className="invalid-feedback d-block">
              {t(errors.assistanceId.message)}
            </div>
          )}
        </div>

        <div className="mb-1">
          <Label for="worktitle">{t("WorkTitle")}</Label>
          <Controller
            name="worktitle"
            control={control}
            render={({ field }) => (
              <Input
                id="worktitle"
                placeholder={t("WorkTitle")}
                invalid={!!errors.worktitle}
                {...field}
              />
            )}
          />
          {errors.worktitle && (
            <FormFeedback>{t(errors.worktitle.message)}</FormFeedback>
          )}
        </div>

        <div className="mb-1">
          <Label for="workDescribe">{t("WorkDescribe")}</Label>
          <Controller
            name="workDescribe"
            control={control}
            render={({ field }) => (
              <Input
                id="workDescribe"
                type="textarea"
                placeholder={t("WorkDescribe")}
                invalid={!!errors.workDescribe}
                {...field}
              />
            )}
          />
          {errors.workDescribe && (
            <FormFeedback>{t(errors.workDescribe.message)}</FormFeedback>
          )}
        </div>

        <div className="mb-1">
          <Label for="workDate">{t("WorkDate")}</Label>
          <Controller
            name="workDate"
            control={control}
            render={({ field }) => (
              <>
                <DatePicker
                  id="workDate"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  value={field.value ? new Date(field.value) : null}
                  editable={false}
                  onChange={(date) => {
                    if (date) {
                      field.onChange(date.toDate().toISOString());
                    } else {
                      field.onChange(null);
                    }
                  }}
                  placeholder="mm/dd/yyyy"
                  inputClass={`form-control ${
                    errors.workDate ? "is-invalid" : ""
                  }`}
                  containerStyle={{ width: "100%" }}
                />
                {errors.workDate && (
                  <div className="invalid-feedback d-block">
                    {t(errors.workDate.message)}
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

export default SidebarNewWork;
