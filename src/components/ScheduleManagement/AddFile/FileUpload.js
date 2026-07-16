import { Button, Col, Form, Label } from "reactstrap";
import * as Yup from "yup";
import ImageDropZone from "../../common/ImageDropZone";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFile } from "../../../core/services/api/sessionManagement/session.service";
import toast from "react-hot-toast";
import formDataConverter from "../../../core/utils/formDataConvertor";

const FileUpload = ({ statusProp, isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    SessionFiles: Yup.mixed().required("FileSelectionRequired"),
  });

  const defaultValues = {
    SessionId: statusProp?.id,
    SessionFiles: null,
  };

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { mutate: sendFileMutate } = useMutation({
    mutationFn: sendFile,
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
    const formData = formDataConverter(data);
    sendFileMutate(formData);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Col sm="12" className="mb-1">
        <Label for="SessionFiles">{t("File")}</Label>

        <ImageDropZone
          currentImage={null}
          error={errors.SessionFiles ? t(errors.SessionFiles.message) : null}
          onChange={(files) => {
            if (files.length > 0) {
              setValue("SessionFiles", files[0], {
                shouldValidate: true,
              });
            } else {
              setValue("SessionFiles", null, {
                shouldValidate: true,
              });
            }
          }}
        />
      </Col>

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

export default FileUpload;
