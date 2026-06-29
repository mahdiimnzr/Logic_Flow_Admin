import { Fragment } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  InputGroup,
} from "reactstrap";
import Cleave from "cleave.js/react";
import { useDispatch, useSelector } from "react-redux";
import { updateAddCourseSliceParams } from "../../../../redux/actions";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ImageDropZone from "../../../common/ImageDropZone";

const defaultValues = {
  GoogleTitle: "",
  GoogleSchema: "",
  CoursePrerequisiteId: "",
  imageAddress: "",
};

const SeoDetails = ({ stepper }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const params = useSelector((state) => state.addCourseSlice.params);

  const SignupSchema = yup.object().shape({
    GoogleTitle: yup.string().required(t("CourseGoogleTitleRequired")),
    GoogleSchema: yup.string().required(t("CourseGoogleSchemaRequired")),
    CoursePrerequisiteId: yup
      .string()
      .required(t("CoursePrerequisiteIdRequired")),
    imageAddress: yup.string().required(t("CourseImageAddressRequired")),
  });

  const numericOptions = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = () => {
    stepper.next();
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">{t("AddCourseSeoDetails")}</h5>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="GoogleTitle">
              {t("CourseGoogleTitle")}
            </Label>
            <Controller
              id="GoogleTitle"
              name="GoogleTitle"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t("CourseGoogleTitlePlaceholder")}
                  invalid={errors.GoogleTitle && true}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    dispatch(
                      updateAddCourseSliceParams({
                        key: "GoogleTitle",
                        value: e.target.value,
                      }),
                    );
                  }}
                />
              )}
            />
            {errors.GoogleTitle && (
              <FormFeedback>{errors.GoogleTitle.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="GoogleSchema">
              {t("CourseGoogleSchema")}
            </Label>
            <Controller
              id="GoogleSchema"
              name="GoogleSchema"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t("CourseGoogleSchemaPlaceholder")}
                  invalid={errors.GoogleSchema && true}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    dispatch(
                      updateAddCourseSliceParams({
                        key: "GoogleSchema",
                        value: e.target.value,
                      }),
                    );
                  }}
                />
              )}
            />
            {errors.GoogleSchema && (
              <FormFeedback>{errors.GoogleSchema.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="CoursePrerequisiteId">
              {t("CoursePrerequisiteId")}
            </Label>
            <Controller
              control={control}
              id="CoursePrerequisiteId"
              name="CoursePrerequisiteId"
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    {...field}
                    className={`form-control ${
                      errors.CoursePrerequisiteId ? "is-invalid" : ""
                    }`}
                    placeholder={t("CoursePrerequisiteIdPlaceholder")}
                    options={numericOptions}
                    id="CoursePrerequisiteId"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.rawValue);
                      dispatch(
                        updateAddCourseSliceParams({
                          key: "CoursePrerequisiteId",
                          value: e.target.rawValue,
                        }),
                      );
                    }}
                  />
                </InputGroup>
              )}
            />
            {errors.CoursePrerequisiteId && (
              <span className="invalid-feedback d-block">
                {errors.CoursePrerequisiteId.message}
              </span>
            )}
          </Col>

          <Col sm="12" className="mb-1">
            <Label for="imageAddress">{t("CourseImageAddress")}</Label>
            <ImageDropZone
              currentImage={null}
              error={
                errors.imageAddress ? t(errors.imageAddress.message) : null
              }
              onChange={(files) => {
                if (files.length > 0) {
                  setValue("imageAddress", URL.createObjectURL(files[0]), {
                    shouldValidate: true,
                  });
                  dispatch(
                    updateAddCourseSliceParams({
                      key: "Image",
                      value: files[0],
                    }),
                  );
                } else {
                  setValue("imageAddress", "", { shouldValidate: true });
                }
              }}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
            <span className="align-middle d-sm-inline-block d-none">
              {t("Previous")}
            </span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">
              {t("Next")}
            </span>
            <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default SeoDetails;
