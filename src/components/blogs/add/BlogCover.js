import { Fragment, useState } from "react";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import { ArrowLeft, ArrowRight, X, DownloadCloud } from "react-feather";
import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { generateImage } from "../../../core/services/api/AI/ai.service";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const BlogCover = ({ stepper, control, setValue, trigger, getValues }) => {
  const { t } = useTranslation();
  const [aiImage, setAiImage] = useState(null);
  const { mutate, isPending } = useMutation({
    mutationFn: generateImage,
    onSuccess: (response) => {
      const file = new File([response.data], "ai-course-cover.png", {
        type: response.data.type || "image/png",
      });
      setAiImage(file);
      setValue("image", file, {
        shouldValidate: true,
      });
    },
    onError: () => {
      toast.error(t("imageGenerateError"));
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("image", file, { shouldValidate: true });
        setAiImage(URL.createObjectURL(file));
      }
    },
  });

  const renderFilePreview = (file) => {
    if (!file) return <FileText size={28} />;

    if (typeof file === "string") {
      return (
        <img
          className="rounded"
          src={file}
          alt="Current"
          width={28}
          height={28}
        />
      );
    }

    if (file?.type?.startsWith("image")) {
      return (
        <img
          className="rounded"
          src={URL.createObjectURL(file)}
          alt={file.name}
          width={28}
          height={28}
        />
      );
    }

    return <FileText size={28} />;
  };

  const handleRemoveFile = () => {
    setValue("image", null, { shouldValidate: true });
    setAiImage(null);
  };

  const handleNext = async () => {
    const isStepValid = await trigger(["image"]);
    if (isStepValid) stepper.next();
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0"> {t("blogCoverTitle")}</h5>
        <small className="text-muted">
          {" "}
          {t("blogCoverDescription")}
          <Button
            size="sm"
            color="primary"
            className="btn-prev mx-2"
            disabled={isPending}
            onClick={() =>
              mutate({
                title: getValues("title"),
                miniDescription: getValues("miniDescribe"),
              })
            }
          >
            {isPending ? t("Generating") : t("createWithAi")}
          </Button>{" "}
        </small>
      </div>

      <div className="mb-1">
        <Controller
          name="image"
          control={control}
          rules={{ required: t("coverImageRequired") }}
          render={({ field, fieldState: { error } }) => (
            <Fragment>
              <div
                {...getRootProps({
                  className: `dropzone ${
                    error ? "border-danger border rounded" : ""
                  }`,
                })}
              >
                <input {...getInputProps()} />
                <div
                  className="d-flex align-items-center justify-content-center flex-column"
                  style={{ padding: "2rem", border: "2px dashed #ebe9f1" }}
                >
                  <DownloadCloud size={64} className="mb-1" />
                  <h5>{t("dropImageTitle")}</h5>
                  <p className="text-secondary">{t("dropImageDescription")}</p>
                </div>
              </div>
              {error && (
                <div className="text-danger mt-50">{error.message}</div>
              )}
            </Fragment>
          )}
        />
        {aiImage && (
          <ListGroup className="my-2">
            <ListGroupItem className="d-flex align-items-center justify-content-between">
              <div className="file-details d-flex align-items-center">
                <div className="file-preview me-1">
                  {renderFilePreview(aiImage)}
                </div>
                <div>
                  <p className="file-name mb-0 text-success">
                    {t("coverSelected")}
                  </p>
                </div>
              </div>
              <Button
                color="danger"
                outline
                size="sm"
                className="btn-icon"
                onClick={handleRemoveFile}
              >
                <X size={14} />
              </Button>
            </ListGroupItem>
          </ListGroup>
        )}
      </div>

      <div className="d-flex justify-content-between mt-2">
        <Button
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
          <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
          <span className="align-middle d-sm-inline-block d-none">
            {" "}
            {t("previous")}
          </span>
        </Button>
        <Button color="primary" className="btn-next" onClick={handleNext}>
          <span className="align-middle d-sm-inline-block d-none">
            {" "}
            {t("next")}
          </span>
          <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
        </Button>
      </div>
    </Fragment>
  );
};

export default BlogCover;
