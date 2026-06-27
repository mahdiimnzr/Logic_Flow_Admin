// ** React Imports
import { Fragment } from "react";

// ** Utils
import { isObjEmpty } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ** Reactstrap Imports
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

const defaultValues = {
  Title: "",
  Cost: "",
  Capacity: "",
  SessionNumber: "",
  MiniDescribe: "",
  StartTime: "",
  EndTime: "",
};

const AccountDetails = ({ stepper }) => {
  const dispatch = useDispatch();

  const SignupSchema = yup.object().shape({
    Title: yup.string().required("پر کردن این فیلد ها ضروری است"),
    Cost: yup.string().required("این فیلد تنها مقادیر عددی را می‌پذیرد"),
    Capacity: yup.string().required("این فیلد تنها مقادیر عددی را می‌پذیرد"),
    SessionNumber: yup
      .string()
      .required("این فیلد تنها مقادیر عددی را می‌پذیرد"),
    MiniDescribe: yup.string().required("پر کردن این فیلد ها ضروری است"),
    StartTime: yup.string().required("پر کردن این فیلد ها ضروری است"),
    EndTime: yup.string().required("پر کردن این فیلد ها ضروری است"),
  });

  const numericOptions = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
  };

  // ** Hooks

  const {
    control,
    handleSubmit,
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
      updateAddCourseSliceParams({
        key: "MiniDescribe",
        value: value.MiniDescribe,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "StartTime",
        value: value.StartTime,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "EndTime",
        value: value.EndTime,
      }),
    );

    stepper.next();
  };
  const params = useSelector((value) => value.addCourseSlice.params);
  console.log(params);

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">اضافه کردن اطلاعات دوره</h5>
        {/* <small className="text-muted">Enter Your Account Details.</small> */}
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="Title">
              نام دوره
            </Label>
            <Controller
              id="Title"
              name="Title"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="نام دوره را وارد کنید"
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
            <Label className="form-label" for={`Cost`}>
              قیمت دوره
            </Label>
            <Controller
              control={control}
              id="Cost"
              name="Cost"
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    className={`form-control ${
                      errors.Cost ? "is-invalid" : ""
                    }`}
                    placeholder=" ظرفیت دوره را وارد کنید"
                    options={numericOptions}
                    id="Cost"
                    invalid={errors.Cost && true}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                    {...field}
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
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="Capacity">
              ظرفیت دوره
            </Label>
            <Controller
              id="Capacity"
              name="Capacity"
              control={control}
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    className={`form-control ${
                      errors.Capacity ? "is-invalid" : ""
                    }`}
                    placeholder=" ظرفیت دوره را وارد کنید"
                    options={numericOptions}
                    id="Capacity"
                    invalid={errors.Capacity && true}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                    {...field}
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
            <Label className="form-label" for={`SessionNumber`}>
              تعداد جلسات دوره
            </Label>
            <Controller
              control={control}
              id="SessionNumber"
              name="SessionNumber"
              render={({ field }) => (
                <InputGroup className="input-group-merge">
                  <Cleave
                    className={`form-control ${
                      errors.SessionNumber ? "is-invalid" : ""
                    }`}
                    placeholder=" ظرفیت دوره را وارد کنید"
                    options={numericOptions}
                    id="SessionNumber"
                    invalid={errors.SessionNumber && true}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.rawValue)}
                    {...field}
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
        </Row>
        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for={`MiniDescribe`}>
              توضیحات مختصر درباره دوره
            </Label>
            <Controller
              control={control}
              id="MiniDescribe"
              name="MiniDescribe"
              render={({ field }) => (
                <Input
                  id="MiniDescribe"
                  name="MiniDescribe"
                  type="textarea"
                  placeholder="توضیات مختصر را وارد کنید"
                  invalid={errors.MiniDescribe && true}
                  {...field}
                />
              )}
            />
            {errors.MiniDescribe && (
              <FormFeedback>{errors.MiniDescribe.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="StartTime">
              شروع دوره :
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
                    placeholder="mm/dd/yyyy"
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
              پایان دوره :
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
                    placeholder="mm/dd/yyyy"
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
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">قبلی</span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">بعدی</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default AccountDetails;
