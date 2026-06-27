// ** React Imports
import { Fragment, useState } from "react";

// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { useGetCourseAdd } from "../../../../core/services/api/CourseList/courseList.service";
import { useDispatch, useSelector } from "react-redux";
import { updateAddCourseSliceParams } from "../../../../redux/actions";

const defaultValues = {
  CourseTypeId: null,
  CourseStatusId: null,
  CourseLvlId: null,
  ClassId: null,
  TeacherId: null,
  TremId: null,
  ShortLink: null,
};

const SignupSchema = yup.object().shape({
  CourseTypeId: yup.string().required("پر کردن این فیلد ضروری است"),
  CourseStatusId: yup.string().required("پر کردن این فیلد ضروری است"),
  CourseLvlId: yup.string().required("پر کردن این فیلد ضروری است"),
  ClassId: yup.string().required("پر کردن این فیلد ضروری است"),
  TeacherId: yup.string().required("پر کردن این فیلد ضروری است"),
  TremId: yup.string().required("پر کردن این فیلد ضروری است"),
  ShortLink: yup.string().required("پر کردن این فیلد ضروری است"),
});

const PersonalInfo = ({ stepper }) => {
  const dispatch = useDispatch();
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
    dispatch(
      updateAddCourseSliceParams({
        key: "CourseTypeId",
        value: value.CourseTypeId,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "CourseStatusId",
        value: value.CourseStatusId,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "CourseLvlId",
        value: value.CourseLvlId,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "ClassId",
        value: value.ClassId,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "TeacherId",
        value: value.TeacherId,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "TremId",
        value: value.TremId,
      }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "ShortLink",
        value: value.ShortLink,
      }),
    );
    stepper.next();
  };
  const params = useSelector((value) => value.addCourseSlice.params);
  console.log(params);

  const { data: courseAdd } = useGetCourseAdd();

  const [currentCourseType, setCurrentCourseType] = useState({
    value: null,
    label: "نحوه برگذاری را انتخواب کنید",
  });
  const courseTypeList = courseAdd?.data?.courseTypeDtos?.map((value) => {
    const courseType = { value: value.id, label: value.typeName };
    return courseType;
  });

  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: "وضعیت برگذاری را انتخواب کنید",
  });
  const statusList = courseAdd?.data?.statusDtos?.map((value) => {
    const status = { value: value.id, label: value.statusName };
    return status;
  });
  const [courseLevel, setCourseLevel] = useState({
    value: "",
    label: " سطح برگذاری دوره را انتخواب کنید",
  });
  const courseLevelList = courseAdd?.data?.courseLevelDtos?.map((value) => {
    const courseLevel = { value: value.id, label: value.levelName };
    return courseLevel;
  });
  const [courseLassRoom, setCourseLassRoom] = useState({
    value: "",
    label: "نام کلاس را انتخواب کنید",
  });
  const classRoomlList = courseAdd?.data?.classRoomDtos?.map((value) => {
    const classRoom = { value: value.id, label: value.classRoomName };
    return classRoom;
  });
  const [courseTeachers, setCourseTeachers] = useState({
    value: "",
    label: "معلم دوره را انتخواب کنید",
  });
  const teachersList = courseAdd?.data?.teachers?.map((value) => {
    const teacher = { value: value.id, label: value.fullName };
    return teacher;
  });
  const [courseTerm, setCourseTerm] = useState({
    value: "",
    label: "نوع ترم را انتخواب کنید",
  });
  const termList = courseAdd?.data?.termDtos?.map((value) => {
    const term = { value: value.id, label: value.termName };
    return term;
  });

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Personal Info</h5>
        <small>Enter Your Personal Info.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm="6" className="mb-1">
            <Label for="CourseTypeId"> نحوه برگذاری</Label>
            <Controller
              name="CourseTypeId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseLvlId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  value={currentCourseType}
                  options={courseTypeList}
                  id="CourseTypeId"
                  name="CourseTypeId"
                  onChange={(data) => {
                    setCurrentCourseType(data);
                    setValue("CourseTypeId", data.value);
                  }}
                />
              )}
            />
            {errors.CourseTypeId && (
              <div className="invalid-feedback d-block">
                پر کردن این فیلد ها ضروری است
              </div>
            )}
          </Col>
          <Col sm="6" className="mb-1">
            <Label for="CourseStatusId"> وضعیت برگذاری</Label>
            <Controller
              name="CourseStatusId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseLvlId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  value={currentStatus}
                  options={statusList}
                  id="CourseStatusId"
                  name="CourseStatusId"
                  onChange={(data) => {
                    setCurrentStatus(data);
                    setValue("CourseStatusId", data.value);
                  }}
                />
              )}
            />
            {errors.CourseStatusId && (
              <div className="invalid-feedback d-block">
                پر کردن این فیلد ها ضروری است
              </div>
            )}
          </Col>
          <Col sm="6" className="mb-1">
            <Label for="CourseLvlId"> سطح برگذاری دوره</Label>
            <Controller
              name="CourseLvlId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseLvlId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  value={courseLevel}
                  options={courseLevelList}
                  id="CourseLvlId"
                  name="CourseLvlId"
                  onChange={(data) => {
                    setCourseLevel(data);
                    setValue("CourseLvlId", data.value);
                  }}
                />
              )}
            />
            {errors.CourseLvlId && (
              <div className="invalid-feedback d-block">
                پر کردن این فیلد ها ضروری است
              </div>
            )}
          </Col>
          <Col sm="6" className="mb-1">
            <Label for="ClassId"> نام کلاس</Label>
            <Controller
              name="ClassId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseLvlId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  value={courseLassRoom}
                  options={classRoomlList}
                  id="ClassId"
                  name="ClassId"
                  onChange={(data) => {
                    setCourseLassRoom(data);
                    setValue("ClassId", data.value);
                  }}
                />
              )}
            />
            {errors.CourseLvlId && (
              <div className="invalid-feedback d-block">
                پر کردن این فیلد ها ضروری است
              </div>
            )}
          </Col>
          <Col sm="6" className="mb-1">
            <Label for="TeacherId"> انتخواب معلم</Label>
            <Controller
              name="TeacherId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseLvlId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  value={courseTeachers}
                  options={teachersList}
                  id="TeacherId"
                  name="TeacherId"
                  onChange={(data) => {
                    setCourseTeachers(data);
                    setValue("TeacherId", data.value);
                  }}
                />
              )}
            />
            {errors.TeacherId && (
              <div className="invalid-feedback d-block">
                پر کردن این فیلد ها ضروری است
              </div>
            )}
          </Col>
          <Col sm="6" className="mb-1">
            <Label for="TremId"> ترم دوره</Label>
            <Controller
              name="TremId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseLvlId ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  value={courseTerm}
                  options={termList}
                  id="TremId"
                  name="TremId"
                  onChange={(data) => {
                    setCourseTerm(data);
                    setValue("TremId", data.value);
                  }}
                />
              )}
            />
            {errors.TremId && (
              <div className="invalid-feedback d-block">
                پر کردن این فیلد ها ضروری است
              </div>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="ShortLink">
              لینک کوتاه دوره
            </Label>
            <Controller
              id="ShortLink"
              name="ShortLink"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Url"
                  invalid={errors.ShortLink && true}
                  {...field}
                />
              )}
            />
            {errors.ShortLink && (
              <FormFeedback>{errors.ShortLink.message}</FormFeedback>
            )}
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
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

export default PersonalInfo;
