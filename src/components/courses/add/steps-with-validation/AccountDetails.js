import { Fragment, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
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
import DatePicker from "react-multi-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { updateAddCourseSliceParams } from "../../../../redux/actions";
import { useTranslation } from "react-i18next";
import Editor from "../../../common/Editor";
import { getDescribe } from "../../../../core/services/api/AI/ai.service";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

const defaultValues = {
  Title: "",
  Cost: "",
  Capacity: "",
  SessionNumber: "",
  Describe: "",
  MiniDescribe: "",
  StartTime: null,
  EndTime: null,
  CurrentCoursePaymentNumber: "",
};

const AccountDetails = ({ stepper }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [editorData, setEditorData] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: getDescribe,
    onSuccess: (response) => {
      setEditorData(response.data);
      setValue("Describe", JSON.stringify(response.data));
    },

    onError: () => {
      toast.error("خطا در دریافت پاسخ");
    },
  });

  const SignupSchema = yup.object().shape({
    Title: yup.string().trim().required(t("CourseTitleRequired")),
    Cost: yup.string().trim().required(t("CourseCostRequired")),
    Capacity: yup.string().trim().required(t("CourseCapacityRequired")),
    SessionNumber: yup
      .string()
      .trim()
      .required(t("CourseSessionNumberRequired")),
    Describe: yup.string().trim().required(t("CourseDescribeRequired")),
    MiniDescribe: yup.string().trim().required(t("CourseMiniDescribeRequired")),
    StartTime: yup.date().nullable().required(t("CourseStartTimeRequired")),
    EndTime: yup
      .date()
      .min(yup.ref("StartTime"), "زمان پایان باید بعد از زمان شروع باشد")
      .nullable()
      .required(t("CourseEndTimeRequired")),
    CurrentCoursePaymentNumber: yup
      .string()
      .trim()
      .required(t("CourseCurrentPaymentNumberRequired")),
  });

  const numericOptions = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (value) => {
    dispatch(updateAddCourseSliceParams({ key: "Title", value: value.Title }));
    dispatch(updateAddCourseSliceParams({ key: "Cost", value: value.Cost }));
    dispatch(
      updateAddCourseSliceParams({ key: "Capacity", value: value.Capacity }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "SessionNumber",
        value: value.SessionNumber,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({ key: "Describe", value: value.Describe }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "MiniDescribe",
        value: value.MiniDescribe,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({ key: "StartTime", value: value.StartTime }),
    );
    dispatch(
      updateAddCourseSliceParams({ key: "EndTime", value: value.EndTime }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "CurrentCoursePaymentNumber",
        value: value.CurrentCoursePaymentNumber,
      }),
    );
    stepper.next();
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">{t("AddCourseInfo")}</h5>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="Title">
              {t("CourseTitle")}
            </Label>
            <Controller
              id="Title"
              name="Title"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t("CourseTitlePlaceholder")}
                  invalid={errors.Title && true}
                  {...field}
                />
              )}
            />
            {errors.Title && (
              <FormFeedback>{errors.Title.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="MiniDescribe">
              {t("CourseMiniDescribe")}
            </Label>
            <Controller
              id="MiniDescribe"
              name="MiniDescribe"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t("CourseMiniDescribePlaceholder")}
                  invalid={errors.MiniDescribe && true}
                  {...field}
                />
              )}
            />
            {errors.MiniDescribe && (
              <FormFeedback>{errors.MiniDescribe.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="Cost">
              {t("CourseCost")}
            </Label>
            <Controller
              control={control}
              id="Cost"
              name="Cost"
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    {...field}
                    className={`form-control ${
                      errors.Cost ? "is-invalid" : ""
                    }`}
                    placeholder={t("CourseCostPlaceholder")}
                    options={numericOptions}
                    id="Cost"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                  />
                </InputGroup>
              )}
            />
            {errors.Cost && (
              <span className="invalid-feedback d-block">
                {errors.Cost.message}
              </span>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="CurrentCoursePaymentNumber">
              {t("CourseCurrentPaymentNumber")}
            </Label>
            <Controller
              control={control}
              id="CurrentCoursePaymentNumber"
              name="CurrentCoursePaymentNumber"
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    {...field}
                    className={`form-control ${
                      errors.CurrentCoursePaymentNumber ? "is-invalid" : ""
                    }`}
                    placeholder={t("CourseCurrentPaymentNumberPlaceholder")}
                    options={numericOptions}
                    id="CurrentCoursePaymentNumber"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                  />
                </InputGroup>
              )}
            />
            {errors.CurrentCoursePaymentNumber && (
              <span className="invalid-feedback d-block">
                {errors.CurrentCoursePaymentNumber.message}
              </span>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="Capacity">
              {t("CourseCapacity")}
            </Label>
            <Controller
              id="Capacity"
              name="Capacity"
              control={control}
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    {...field}
                    className={`form-control ${
                      errors.Capacity ? "is-invalid" : ""
                    }`}
                    placeholder={t("CourseCapacityPlaceholder")}
                    options={numericOptions}
                    id="Capacity"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                  />
                </InputGroup>
              )}
            />
            {errors.Capacity && (
              <span className="invalid-feedback d-block">
                {errors.Capacity.message}
              </span>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="SessionNumber">
              {t("CourseSessionNumber")}
            </Label>
            <Controller
              control={control}
              id="SessionNumber"
              name="SessionNumber"
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    {...field}
                    className={`form-control ${
                      errors.SessionNumber ? "is-invalid" : ""
                    }`}
                    placeholder={t("CourseSessionNumberPlaceholder")}
                    options={numericOptions}
                    id="SessionNumber"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                  />
                </InputGroup>
              )}
            />
            {errors.SessionNumber && (
              <span className="invalid-feedback d-block">
                {errors.SessionNumber.message}
              </span>
            )}
          </Col>

          <Col md="12" className="mb-1">
            <Label className="form-label" for="Describe">
              {t("CourseDescribe")}{" "}
              <Button
                size="sm"
                color="primary"
                className="btn-prev mx-2"
                disabled={isPending}
                onClick={() =>
                  getValues("Title") &&
                  getValues("MiniDescribe") &&
                  mutate([
                    {
                      role: "user",
                      content:
                        getValues("Title").trim() +
                        ", " +
                        getValues("MiniDescribe").trim(),
                    },
                  ])
                }
              >
                {isPending ? t("Generating") : t("createWithAi")}
              </Button>
            </Label>
            <Controller
              control={control}
              id="Describe"
              name="Describe"
              render={({ field }) => (
                <Editor
                  data={editorData}
                  placeholder={t("CourseDescribePlaceholder")}
                  onChange={async (data) => {
                    field.onChange(JSON.stringify(await data));
                    setEditorData(await data);
                  }}
                  error={errors.Describe && true}
                  editorBlock={"editorJs-container"}
                  isAI={isPending}
                />
              )}
            />
            {errors.Describe && (
              <FormFeedback>{errors.Describe.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="StartTime">
              {t("CourseStartTime")} :
            </Label>
            <Controller
              name="StartTime"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    id="StartTime"
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
                      errors.StartTime ? "is-invalid" : ""
                    }`}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.StartTime && (
                    <span className="invalid-feedback d-block">
                      {errors.StartTime.message}
                    </span>
                  )}
                </>
              )}
            />
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="EndTime">
              {t("CourseEndTime")} :
            </Label>
            <Controller
              name="EndTime"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    id="EndTime"
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
                      errors.EndTime ? "is-invalid" : ""
                    }`}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.EndTime && (
                    <span className="invalid-feedback d-block">
                      {errors.EndTime.message}
                    </span>
                  )}
                </>
              )}
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

export default AccountDetails;
