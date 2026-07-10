import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { postAddTermCloseDate } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useTranslation } from "react-i18next";

const AddCloseDateModal = ({ toggle, termList, isOpen }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [currentTerm, setCurrentTerm] = useState({
    value: "",
    label: t("SelectTerm"),
  });

  const termOptions = termList?.map((term) => ({
    value: term.id,
    label: term.termName,
  })) || [];

  const selectedTerm = termList?.find((term) => term.id === currentTerm.value);

  const validationSchema = Yup.object({
    startCloseDate: Yup.date()
      .min(
        selectedTerm?.startDate ? new Date(selectedTerm.startDate) : new Date(),
        "StartCloseDateAfterTermStart"
      )
      .max(
        selectedTerm?.endDate ? new Date(selectedTerm.endDate) : new Date(),
        "StartCloseDateBeforeTermEnd"
      )
      .nullable()
      .required("DateRequired"),
    endCloseDate: Yup.date()
      .min(Yup.ref("startCloseDate"), "EndDateAfterStart")
      .max(
        selectedTerm?.endDate ? new Date(selectedTerm.endDate) : new Date(),
        "EndCloseDateBeforeTermEnd"
      )
      .nullable()
      .required("DateRequired"),
    closeReason: Yup.string().trim().required("CloseReasonRequired"),
    termId: Yup.string().required("TermRequired"),
  });

  const defaultValues = {
    startCloseDate: null,
    endCloseDate: null,
    closeReason: "",
    termId: "",
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

  const { mutate: postAddTermCloseDateMutation } = useMutation({
    mutationFn: postAddTermCloseDate,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success(response.data.message, { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["Term"] });
      toggle();
      setValue("startCloseDate", null);
      setValue("endCloseDate", null);
      setValue("closeReason", "");
      setValue("termId", "");
      setCurrentTerm({ value: "", label: t("SelectTerm") });
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    postAddTermCloseDateMutation(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered modal-lg"
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <ModalHeader toggle={toggle}>
        {t("AddCloseDate")}
      </ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <Row tag="form" className="gy-1 pt-75" onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label for="termId">{t("Term")}</Label>
            <Select
              isClearable={false}
              value={currentTerm}
              options={termOptions}
              className={`react-select ${errors.termId ? "is-invalid" : ""}`}
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(data) => {
                setCurrentTerm(data);
                setValue("termId", data.value);
              }}
            />
            {errors.termId && (
              <div className="invalid-feedback d-block">
                {t(errors.termId.message)}
              </div>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="startCloseDate">
              {t("StartCloseDate")}
            </Label>
            <Controller
              name="startCloseDate"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={field.value ? new Date(field.value) : null}
                    editable={false}
                    placeholder={t("DatePlaceholder")}
                    onChange={(date) =>
                      field.onChange(date ? date.toDate().toISOString() : null)
                    }
                    inputClass={`form-control ${errors.startCloseDate ? "is-invalid" : ""}`}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.startCloseDate && (
                    <span className="invalid-feedback d-block">
                      {t(errors.startCloseDate.message)}
                    </span>
                  )}
                </>
              )}
            />
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="endCloseDate">
              {t("EndCloseDate")}
            </Label>
            <Controller
              name="endCloseDate"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={field.value ? new Date(field.value) : null}
                    editable={false}
                    placeholder={t("DatePlaceholder")}
                    onChange={(date) =>
                      field.onChange(date ? date.toDate().toISOString() : null)
                    }
                    inputClass={`form-control ${errors.endCloseDate ? "is-invalid" : ""}`}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.endCloseDate && (
                    <span className="invalid-feedback d-block">
                      {t(errors.endCloseDate.message)}
                    </span>
                  )}
                </>
              )}
            />
          </Col>

          <Col xs={12}>
            <Label className="form-label" for="closeReason">
              {t("CloseReason")}
            </Label>
            <Controller
              name="closeReason"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="closeReason"
                  placeholder={t("CloseReason")}
                  invalid={!!errors.closeReason}
                />
              )}
            />
            {errors.closeReason && (
              <span className="invalid-feedback d-block">
                {t(errors.closeReason.message)}
              </span>
            )}
          </Col>

          <Col xs={12} className="text-center mt-2 pt-50">
            <Button type="submit" className="me-1" color="primary">
              {t("Submit")}
            </Button>
            <Button color="secondary" outline onClick={toggle}>
              {t("Cancel")}
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default AddCloseDateModal;