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

  const [currentRole, setCurrentRole] = useState({
    value: "",
    label: "انتخاب ترم",
  });
  const roleOptions = termList?.map((value) => {
    const roles = { value: value.id, label: value.termName };
    return roles;
  });
  const findTermStateDate = termList?.find(
    (term) => term.id === currentRole?.value,
  )?.startDate;
  const findTermEndDate = termList?.find(
    (term) => term.id === currentRole?.value,
  )?.endDate;

  const validationSchema = Yup.object({
    startCloseDate: Yup.date()
      .min(
        findTermStateDate ? new Date(findTermStateDate) : new Date(),
        "زمان شروع باید بعد از تاریخ شروع ترم باشد",
      )
      .max(
        findTermEndDate ? new Date(findTermEndDate) : new Date(),
        "زمان شروع نباید بعد از تاریخ پایان ترم باشد",
      )
      .nullable()
      .required("انتخواب زمان الزامی است"),
    endCloseDate: Yup.date()
      .min(Yup.ref("startCloseDate"), "زمان پایان باید بعد از زمان شروع باشد")
      .max(
        findTermEndDate ? new Date(findTermEndDate) : new Date(),
        "زمان پایان نباید بعد از تاریخ پایان ترم باشد",
      )
      .nullable()
      .required("انتخواب زمان الزامی است"),
    closeReason: Yup.string().trim().required(" پرکردن این فیلد الزامی است"),
    termId: Yup.string().required("لطفا یک ترم را انتخاب کنید"),
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
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

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
      setValue("startCloseDate", "");
      setValue("endCloseDate", "");
      setValue("closeReason", "");
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });
  const onSubmit = (data) => {
    postAddTermCloseDateMutation(data);
  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      style={{ fontFamily: "IRANYekanXFaNum" }}
      className="modal-dialog-centered modal-lg"
    >
      <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <div className="text-center mb-2">
          <h1 className="mb-1">ساخت تاریخ بسته بودن</h1>
        </div>
        <Row
          tag="form"
          className="gy-1 pt-75"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label for="termId">{t("CourseStatusId")}</Label>
          <Select
            isClearable={false}
            value={currentRole}
            options={roleOptions}
            className={`react-select ${errors.termId ? "is-invalid" : ""}`}
            classNamePrefix="select"
            id="termId"
            theme={selectThemeColors}
            onChange={(data) => {
              setCurrentRole(data);
              setValue("termId", data.value);
            }}
          />
          {errors.termId && (
            <div className="invalid-feedback d-block">
              {errors.termId.message}
            </div>
          )}
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
            <Button color="secondary" outline onClick={toggle}>
              منصرف
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default AddCloseDateModal;
