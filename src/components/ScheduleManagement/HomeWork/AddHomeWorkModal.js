import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import * as Yup from "yup";
import { addHomeWork } from "../../../core/services/api/sessionManagement/session.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AddHomeWorkModal = ({ isOpen, setIsOpen, sessionDetailProp }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    hwTitle: Yup.string().trim().required("HomeworkTitleRequired"),
    hwDescribe: Yup.string().trim().required("HomeworkDescriptionRequired"),
  });

  const defaultValues = {
    sessionId: sessionDetailProp?.sessionId,
    hwTitle: "",
    hwDescribe: "",
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

  const { mutate: addHomeWorkMutate } = useMutation({
    mutationFn: addHomeWork,

    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },

    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, {
          id: context.toastId,
        });

        queryClient.invalidateQueries({
          queryKey: [`SessionHomeWork-${sessionDetailProp?.sessionId}`],
        });

        setIsOpen(!isOpen);
      } else {
        toast.error(response?.data?.message || t("SomethingWentWrong"), {
          id: context.toastId,
        });
      }
    },

    onError: (response, _, context) => {
      toast.error(response?.data?.message || t("SomethingWentWrong"), {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => {
    addHomeWorkMutate(data);
  };

  useEffect(() => {
    setValue("sessionId", sessionDetailProp?.sessionId);
  }, [sessionDetailProp]);

  return (
    <Modal
      unmountOnClose
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className="modal-dialog-centered"
      onClosed={() => {
        setValue("hwTitle", "");
        setValue("hwDescribe", "");
      }}
      style={{ fontFamily: "IRANYekanXFaNum" }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={() => setIsOpen(!isOpen)}>
          {t("AddHomework")}
        </ModalHeader>

        <ModalBody>
          <Col xs="12" className="mb-1">
            <Label className="form-label" for="hwTitle">
              {t("HomeworkTitle")}
            </Label>

            <Controller
              name="hwTitle"
              control={control}
              render={({ field }) => (
                <Input
                  id="hwTitle"
                  placeholder={t("HomeworkTitle")}
                  invalid={!!errors.hwTitle}
                  {...field}
                />
              )}
            />

            {errors.hwTitle && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {t(errors.hwTitle.message)}
              </span>
            )}
          </Col>

          <Col xs="12" className="mb-1">
            <Label className="form-label" for="hwDescribe">
              {t("HomeworkDescription")}
            </Label>

            <Controller
              name="hwDescribe"
              control={control}
              render={({ field }) => (
                <Input
                  id="hwDescribe"
                  placeholder={t("HomeworkDescription")}
                  invalid={!!errors.hwDescribe}
                  {...field}
                />
              )}
            />

            {errors.hwDescribe && (
              <span className="text-danger" style={{ fontSize: "12px" }}>
                {t(errors.hwDescribe.message)}
              </span>
            )}
          </Col>
        </ModalBody>

        <ModalFooter className="d-flex align-items-center justify-content-between">
          <Button type="submit" className="me-1" color="primary">
            {t("Add")}
          </Button>

          <Button color="secondary" outline onClick={() => setIsOpen(false)}>
            {t("Cancel")}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddHomeWorkModal;
