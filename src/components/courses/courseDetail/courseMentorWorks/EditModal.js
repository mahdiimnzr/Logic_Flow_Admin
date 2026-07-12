import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { selectThemeColors } from "@utils";
import { updateAssistanceWork } from "../../../../core/services/api/CourseList/courseList.service";

const validationSchema = Yup.object({
  worktitle: Yup.string().trim().required("WorkTitleRequired"),
  workDescribe: Yup.string().trim().required("WorkDescribeRequired"),
  workDate: Yup.string().nullable().required("WorkDateRequired"),
  assistanceId: Yup.string().required("MentorRequired"),
});

const EditModal = ({ isOpen, toggle, work, mentors }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mentorOptions = mentors?.map((mentor) => ({
    value: mentor.id,
    label: mentor.assistanceName,
  })) || [];

  const defaultValues = {
    id: work?.id ?? "",
    worktitle: work?.worktitle ?? "",
    workDescribe: work?.workDescribe ?? "",
    workDate: work?.workDate ?? null,
    assistanceId: work?.assistanceId ?? "",
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { mutate: updateWorkMutate } = useMutation({
    mutationFn: updateAssistanceWork,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({ queryKey: ["AssistanceWork"] });
        toggle();
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    updateWorkMutate(data);
  };

  return (
    <Modal
      unmountOnClose
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered"
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <ModalHeader toggle={toggle}>
        {t("EditWork")}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <Label className="form-label" for="assistanceId">
              {t("SelectMentor")} <span className="text-danger">*</span>
            </Label>
            <Controller
              name="assistanceId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${errors.assistanceId ? "is-invalid" : ""}`}
                  classNamePrefix="select"
                  options={mentorOptions}
                  value={mentorOptions.find((m) => m.value === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.value)}
                />
              )}
            />
            {errors.assistanceId && (
              <FormFeedback>{t(errors.assistanceId.message)}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="worktitle">
              {t("WorkTitle")} <span className="text-danger">*</span>
            </Label>
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
            <Label className="form-label" for="workDescribe">
              {t("WorkDescribe")} <span className="text-danger">*</span>
            </Label>
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
            <Label className="form-label" for="workDate">
              {t("WorkDate")} <span className="text-danger">*</span>
            </Label>
            <Controller
              name="workDate"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-center"
                    value={field.value ? new Date(field.value) : null}
                    editable={false}
                    onChange={(date) => {
                      field.onChange(date ? date.toDate().toISOString() : null);
                    }}
                    placeholder="mm/dd/yyyy"
                    inputClass={`form-control ${errors.workDate ? "is-invalid" : ""}`}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.workDate && (
                    <FormFeedback>{t(errors.workDate.message)}</FormFeedback>
                  )}
                </>
              )}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggle}>
          {t("Cancel")}
        </Button>
        <Button color="primary" onClick={handleSubmit(onSubmit)}>
          {t("SaveChanges")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;