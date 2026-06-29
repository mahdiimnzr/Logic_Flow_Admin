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
import { createCourseStepTwo } from "../../../../core/services/api/CourseList/courseList.service";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import formDataConverter from "../../../../core/utils/formDataConvertor";
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

  const { mutate: createCourseMutate } = useMutation({
    mutationFn: createCourseStepTwo,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        stepper.next();
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const onSubmit = (value) => {
    const formData = formDataConverter(params);
    createCourseMutate(formData);
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">{t("AddCourseInfo")}</h5>
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
                  onChange={(data) => {
                    setValue("GoogleTitle", data.target.value);
                    dispatch(
                      updateAddCourseSliceParams({
                        key: "GoogleTitle",
                        value: data.target.value,
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
                  onChange={(data) => {
                    setValue("GoogleSchema", data.target.value);
                    dispatch(
                      updateAddCourseSliceParams({
                        key: "GoogleSchema",
                        value: data.target.value,
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
                    className={`form-control ${
                      errors.CoursePrerequisiteId ? "is-invalid" : ""
                    }`}
                    placeholder={t("CoursePrerequisiteIdPlaceholder")}
                    options={numericOptions}
                    id="CoursePrerequisiteId"
                    invalid={errors.CoursePrerequisiteId && true}
                    value={field.value}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.rawValue);
                      setValue("CoursePrerequisiteId", e.target.rawValue);
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
                      key: "imageAddress",
                      value: URL.createObjectURL(files[0]),
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
          <Button color="secondary" className="btn-prev" outline disabled>
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
