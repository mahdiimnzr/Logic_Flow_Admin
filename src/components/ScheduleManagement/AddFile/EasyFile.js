import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { sendFileUrl } from "../../../core/services/api/sessionManagement/session.service";
import toast from "react-hot-toast";
import { Button, Form, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

const EasyFile = ({ statusProp, setIsOpen, isOpen }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    Url: Yup.string().trim().required("FileUrlRequired"),
  });

  const defaultValues = {
    SessionId: statusProp?.id,
    Url: "",
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

  const { mutate: sendFileUrlMutate } = useMutation({
    mutationFn: sendFileUrl,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`SessionDetail-${statusProp?.id}`],
        });
        setIsOpen(!isOpen);
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    sendFileUrlMutate(data);
  };

  useEffect(() => {
    setValue("SessionId", statusProp?.id);
  }, [statusProp]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-1">
        <Label className="form-label" for="Url">
          {t("HomeworkFileUrl")}
        </Label>

        <Controller
          name="Url"
          control={control}
          render={({ field }) => (
            <Input
              id="Url"
              placeholder={t("FileUrl")}
              invalid={!!errors.Url}
              {...field}
            />
          )}
        />

        {errors.Url && (
          <span className="text-danger" style={{ fontSize: "12px" }}>
            {t(errors.Url.message)}
          </span>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <Button type="submit" className="me-1" color="primary">
          {t("Submit")}
        </Button>

        <Button
          type="reset"
          color="secondary"
          outline
          onClick={() => setIsOpen(!isOpen)}
        >
          {t("Cancel")}
        </Button>
      </div>
    </Form>
  );
};

export default EasyFile;
