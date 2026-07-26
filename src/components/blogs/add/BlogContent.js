import { Fragment, useEffect, useState } from "react";
import { Label, Button } from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Editor from "../../common/Editor";
import { getDescribe } from "../../../core/services/api/AI/ai.service";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const BlogContent = ({
  stepper,
  errors,
  control,
  trigger,
  isEditMode,
  getValues,
  setValue,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState(true);
  const [editorData, setEditorData] = useState(getValues("describe") || {});

  const { mutate, isPending } = useMutation({
    mutationFn: getDescribe,
    onSuccess: (response) => {
      setEditorData(response.data);
      setValue("describe", JSON.stringify(response.data));
    },

    onError: (error) => {
      toast.error(t("generateError"));
    },
  });

  const validationChecker = () => {
    if (editorData?.blocks?.length > 0) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const getEditorBlocks = (desc) => {
    if (!desc) return {};
    try {
      const describe = JSON.parse(desc);
      if (!Array.isArray(describe.blocks)) throw new Error();

      describe?.blocks.map((data) => ({
        ...data,
        type: data.type === "p" ? "paragraph" : data.type,
      }));

      return setEditorData(describe);
    } catch {
      return setEditorData({
        time: new Date(),
        blocks: [
          {
            type: "paragraph",
            data: { text: desc },
          },
        ],
        version: "2.81.0",
      });
    }
  };
  const handleNext = async () => {
    const isStepValid = error;

    if (!isStepValid) stepper.next();
  };

  useEffect(() => {
    validationChecker();
  }, [editorData]);

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">{t("blogContentTitle")}</h5>
        <small className="text-muted"> {t("blogContentDescription")} </small>
      </div>

      <div className="mb-1">
        <Label className="form-label" for="describe">
          {t("articleBody")}
          <span className="text-danger">*</span>
          {!isEditMode && (
            <Button
              size="sm"
              color="primary"
              className="btn-prev mx-2"
              disabled={isPending}
              onClick={() =>
                mutate([
                  {
                    role: "user",
                    content:
                      getValues("title").trim() +
                      ", " +
                      getValues("miniDescribe").trim(),
                  },
                ])
              }
            >
              {isPending ? t("Generating") : t("createWithAi")}
            </Button>
          )}
        </Label>

        <div className={error ? "border border-danger rounded" : ""}>
          <Controller
            name="describe"
            control={control}
            render={({ field }) => (
              <Editor
                data={editorData}
                placeholder={t("articleBodyPlaceholder")}
                onChange={async (data) => {
                  field.onChange(JSON.stringify(await data));
                  setEditorData(await data);
                }}
                error={error && true}
                editorBlock={"editorJs-container"}
                isAI={isPending}
              />
            )}
          />
        </div>

        {error && (
          <span className="text-danger fs-6 mt-1 d-block">
            {t("generateError")}
          </span>
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

export default BlogContent;
