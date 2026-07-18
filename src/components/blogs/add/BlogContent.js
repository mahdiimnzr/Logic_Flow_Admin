import { Fragment } from "react";
import { Label, Button } from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Editor from "../../common/Editor";

const BlogContent = ({
  stepper,
  errors,
  control,
  trigger,
  isEditMode,
  getValues,
}) => {
  const getEditorBlocks = (desc) => {
    if (!desc) return {};
    try {
      const describe = JSON.parse(desc);
      if (!Array.isArray(describe.blocks)) throw new Error();

      describe?.blocks.map((data) => ({
        ...data,
        type: data.type === "p" ? "paragraph" : data.type,
      }));

      return describe;
    } catch {
      return {
        time: new Date(),
        blocks: [
          {
            type: "paragraph",
            data: { text: desc },
          },
        ],
        version: "2.81.0",
      };
    }
  };
  const handleNext = async () => {
    const isStepValid = await trigger(["describe"]);
    if (isStepValid) stepper.next();
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">محتوای مقاله</h5>
        <small className="text-muted">متن اصلی مقاله را اینجا بنویسید.</small>
      </div>

      <div className="mb-1">
        <Label className="form-label" for="describe">
          بدنه مقاله <span className="text-danger">*</span>
        </Label>

        <div className={errors.describe ? "border border-danger rounded" : ""}>
          <Controller
            name="describe"
            control={control}
            render={({ field }) => (
              <Editor
                data={
                  isEditMode
                    ? getEditorBlocks(getValues("describe"))
                    : undefined
                }
                placeholder={"وارد کردن متن مقاله الزامی است"}
                onChange={async (data) => {
                  field.onChange(JSON.stringify(await data));
                }}
                error={errors.describe && true}
                editorBlock={"editorJs-container"}
              />
            )}
          />
        </div>

        {errors.describe && (
          <span className="text-danger fs-6 mt-1 d-block">
            {errors.describe.message}
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
          <span className="align-middle d-sm-inline-block d-none">قبلی</span>
        </Button>
        <Button color="primary" className="btn-next" onClick={handleNext}>
          <span className="align-middle d-sm-inline-block d-none">بعدی</span>
          <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
        </Button>
      </div>
    </Fragment>
  );
};

export default BlogContent;
