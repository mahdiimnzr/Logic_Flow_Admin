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
    startCloseDate: Yup.string().required(".........."),
    endCloseDate: Yup.string().required("........."),
    closeReason: Yup.string().required("..........."),
  });
  console.log(row);
  const defaultValues = {
    termId: row?.id ?? "",
    startCloseDate: row?.startDate ?? "",
    endCloseDate: row?.endDate ?? "",
    closeReason: row?.closeReason ?? "",
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  // ** Handle Submit
  const { mutate: UpdateTermCloseDateMutate } = useMutation({
    mutationFn: UpdateTermCloseDate,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`Term`],
        });
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
    UpdateTermCloseDateMutate(data);
  };
  return (
    <Modal
      isOpen={isOpen}
      toggleUpdate={toggleUpdate}
      style={{ fontFamily: "IRANYekanXFaNum" }}
      className="modal-dialog-centered "
    >
      <ModalHeader
        className="bg-transparent"
        toggleUpdate={toggleUpdate}
      ></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <div className="text-center mb-2">
          <h1 className="mb-1">ویرایش اطلاعات ترم</h1>
        </div>
        <Row
          tag="form"
          className="gy-1 pt-75"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Col md="6" className="mb-1">
            <Label className="form-label" for="startCloseDate">
              زمان شروع
            </Label>
            <Controller
              name="startCloseDate"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    id="startCloseDate"
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    value={field.value ? new Date(field.value) : null}
                    editable={false}
                    placeholder={t("DatePlaceholder")}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date.toDate().toISOString());
                      } else {
                        field.onChange(null);
                      }
                    }}
                    inputClass={`form-control ${
                      errors.startCloseDate ? "is-invalid" : ""
                    }`}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.startCloseDate && (
                    <span className="invalid-feedback d-block">
                      {errors.startCloseDate.message}
                    </span>
                  )}
                </>
              )}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="endCloseDate">
              زمان پایان
            </Label>
            <Controller
              name="endCloseDate"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    id="endCloseDate"
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    value={field.value ? new Date(field.value) : null}
                    editable={false}
                    placeholder={t("DatePlaceholder")}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date.toDate().toISOString());
                      } else {
                        field.onChange(null);
                      }
                    }}
                    inputClass={`form-control ${
                      errors.endCloseDate ? "is-invalid" : ""
                    }`}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.endCloseDate && (
                    <span className="invalid-feedback d-block">
                      {errors.endCloseDate.message}
                    </span>
                  )}
                </>
              )}
            />
          </Col>
          <Col xs={12}>
            <Label className="form-label" for="closeReason">
              دلیل بسته بودن
            </Label>
            <Controller
              name="closeReason"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="closeReason"
                  placeholder="دلیل بسته بودن"
                  invalid={errors.closeReason && true}
                />
              )}
            />
            {errors.closeReason && (
              <span className="invalid-feedback d-block">
                {errors.closeReason.message}
              </span>
            )}
          </Col>

          <Col xs={12} className="text-center mt-2 pt-50">
            <Button type="submit" className="me-1" color="primary">
              تغیرات
            </Button>
            <Button color="secondary" outline onClick={toggleUpdate}>
              منصرف
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default EditCloseDateModal;
