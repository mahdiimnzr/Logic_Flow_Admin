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
  worktitle: Yup.string().required("WorkTitleRequired"),
  workDescribe: Yup.string().required("WorkDescribeRequired"),
  workDate: Yup.string().nullable().required("WorkDateRequired"),
  assistanceId: Yup.string().required("MentorRequired"),
});

const EditModal = ({ isOpen, toggle, work, mentors }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mentorsList = mentors?.map((value) => {
    const mentor = { value: value.id, label: value.assistanceName };
    return mentor;
  });

  const fundedMentor = mentors?.find(
    (value) => value.id === work?.assistanceId,
  );

  const [currentMentor, setCurrentMentor] = useState({
    value: work?.assistanceId,
    label: fundedMentor?.assistanceName,
  });

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
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

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
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    updateWorkMutate(data);
  };

  return (
    <Modal
      unmountOnClose={true}
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered"
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <ModalHeader toggle={toggle}>{t("EditWork")}</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <Input id="worktitle" invalid={!!errors.worktitle} {...field} />
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
        </form>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <Button color="secondary" outline onClick={toggle}>
          {t("Cancel")}
        </Button>
        <Button color="primary" onClick={handleSubmit(onSubmit)}>
          {t("ApplyStatus")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
