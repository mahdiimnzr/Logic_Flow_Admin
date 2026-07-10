import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DatePicker from "react-multi-date-picker";
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
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { UpdateTermCloseDate } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const EditCloseDateModal = ({ toggleUpdate, isOpen, row }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    startCloseDate: Yup.date()
      .min(row?.startDate, "StartCloseDateAfterTermStart")
      .nullable()
      .required("DateRequired"),
    endCloseDate: Yup.date()
      .min(Yup.ref("startCloseDate"), "EndDateAfterStart")
      .max(row?.endDate, "EndCloseDateBeforeTermEnd")
      .nullable()
      .required("DateRequired"),
    closeReason: Yup.string().required("CloseReasonRequired"),
  });

  const defaultValues = {
    termId: row?.id ?? "",
    startCloseDate: row?.startDate ?? null,
    endCloseDate: row?.endDate ?? null,
    closeReason: row?.closeReason ?? "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { mutate: UpdateTermCloseDateMutate } = useMutation({
    mutationFn: UpdateTermCloseDate,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({ queryKey: ["Term"] });
        toggleUpdate();
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    UpdateTermCloseDateMutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggleUpdate}
      className="modal-dialog-centered"
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <ModalHeader toggle={toggleUpdate}>
        {t("EditCloseDate")}
      </ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <Row tag="form" className="gy-1 pt-75" onSubmit={handleSubmit(onSubmit)}>
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

          <Col xs={12} className="text-center mt-2 pt-50 d-flex align-items-center justify-content-between">
            <Button type="submit" className="me-1" color="primary">
              {t("SaveChanges")}
            </Button>
            <Button color="secondary" outline onClick={toggleUpdate}>
              {t("Cancel")}
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default EditCloseDateModal;