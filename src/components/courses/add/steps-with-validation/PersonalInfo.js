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

const defaultValues = {
  Url: "",
  level: "",
};

const SignupSchema = yup.object().shape({
  Url: yup.string().required("پر کردن این فیلد ضروری است"),
  level: yup.string().required("پر کردن این فیلد ضروری است"),
});

const PersonalInfo = ({ stepper }) => {
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (data) => {
    stepper.next();
  };

  const { data: courseAdd } = useGetCourseAdd();

  const [currentCourseType, setCurrentCourseType] = useState({
    value: "",
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
          <Col md="6" className="mb-1">
            <Label className="form-label" for="نحوه برگذاری">
              نحوه برگذاری
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={` نحوه برگذاری`}
              value={currentCourseType}
              options={courseTypeList}
              onChange={(data) => {
                setCurrentCourseType(data);
              }}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="وضعیت برگذاری">
              وضعیت برگذاری
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={`وضعیت برگذاری`}
              value={currentStatus}
              options={statusList}
              onChange={(data) => {
                setCurrentStatus(data);
              }}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="level">
              سطح برگذاری دوره
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id="level"
              name="level"
              value={courseLevel}
              options={courseLevelList}
              onChange={(data) => {
                setCourseLevel(data);
              }}
            />
            {errors.level && (
              <FormFeedback>{errors.level.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for=" نام کلاس">
              نام کلاس
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={` نام کلاس`}
              value={courseLassRoom}
              options={classRoomlList}
              onChange={(data) => {
                setCourseLassRoom(data);
              }}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="انتخواب معلم">
              انتخواب معلم
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={`انتخواب معلم`}
              value={courseTeachers}
              options={teachersList}
              onChange={(data) => {
                setCourseTeachers(data);
              }}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="ترم دوره">
              ترم دوره
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={`انتخواب معلم`}
              value={courseTerm}
              options={termList}
              onChange={(data) => {
                setCourseTerm(data);
              }}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="Url">
              لینک کوتاه دوره
            </Label>
            <Controller
              id="Url"
              name="Url"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Url"
                  invalid={errors.Url && true}
                  {...field}
                />
              )}
            />
            {errors.Url && <FormFeedback>{errors.Url.message}</FormFeedback>}
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
