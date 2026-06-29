import { Fragment, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectThemeColors } from "@utils";
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import { useGetCourseAdd } from "../../../../core/services/api/CourseList/courseList.service";
import { useDispatch } from "react-redux";
import { updateAddCourseSliceParams } from "../../../../redux/actions";
import { useTranslation } from "react-i18next";

const defaultValues = {
  CourseTypeId: "",
  CourseStatusId: "",
  CourseLvlId: "",
  ClassId: "",
  TeacherId: "",
  TremId: "",
  ShortLink: "",
};

const PersonalInfo = ({ stepper }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const SignupSchema = yup.object({
    CourseTypeId: yup.string().required(t("CourseTypeIdRequired")),
    CourseStatusId: yup.string().required(t("CourseStatusIdRequired")),
    CourseLvlId: yup.string().required(t("CourseLvlIdRequired")),
    ClassId: yup.string().required(t("CourseClassIdRequired")),
    TeacherId: yup.string().required(t("CourseTeacherIdRequired")),
    TremId: yup.string().required(t("CourseTremIdRequired")),
    ShortLink: yup.string().required(t("CourseShortLinkRequired")),
    UniqeUrlString: yup.string().required(t("CourseUniqeUrlStringRequired")),
  });

  const {
    control,
    handleSubmit,
    setValue,
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
      updateAddCourseSliceParams({ key: "ClassId", value: value.ClassId }),
    );
    dispatch(
      updateAddCourseSliceParams({ key: "TeacherId", value: value.TeacherId }),
    );
    dispatch(
      updateAddCourseSliceParams({ key: "TremId", value: value.TremId }),
    );
    dispatch(
      updateAddCourseSliceParams({ key: "ShortLink", value: value.ShortLink }),
    );
    dispatch(
      updateAddCourseSliceParams({
        key: "UniqeUrlString",
        value: value.UniqeUrlString,
      }),
    );
    stepper.next();
  };

  const { data: courseAdd } = useGetCourseAdd();

  const [currentCourseType, setCurrentCourseType] = useState({
    value: null,
    label: t("CourseTypeSelectPlaceholder"),
  });
  const courseTypeList = courseAdd?.data?.courseTypeDtos?.map((value) => ({
    value: value.id,
    label: value.typeName,
  }));

  const [currentStatus, setCurrentStatus] = useState({
    value: null,
    label: t("CourseStatusSelectPlaceholder"),
  });
  const statusList = courseAdd?.data?.statusDtos?.map((value) => ({
    value: value.id,
    label: value.statusName,
  }));

  const [courseLevel, setCourseLevel] = useState({
    value: null,
    label: t("CourseLvlSelectPlaceholder"),
  });
  const courseLevelList = courseAdd?.data?.courseLevelDtos?.map((value) => ({
    value: value.id,
    label: value.levelName,
  }));

  const [courseLassRoom, setCourseLassRoom] = useState({
    value: null,
    label: t("CourseClassSelectPlaceholder"),
  });
  const classRoomlList = courseAdd?.data?.classRoomDtos?.map((value) => ({
    value: value.id,
    label: value.classRoomName,
  }));

  const [courseTeachers, setCourseTeachers] = useState({
    value: null,
    label: t("CourseTeacherSelectPlaceholder"),
  });
  const teachersList = courseAdd?.data?.teachers?.map((value) => ({
    value: value.teacherId,
    label: value.fullName,
  }));

  const [courseTerm, setCourseTerm] = useState({
    value: null,
    label: t("CourseTremSelectPlaceholder"),
  });
  const termList = courseAdd?.data?.termDtos?.map((value) => ({
    value: value.id,
    label: value.termName,
  }));

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">{t("AddCourseDetails")}</h5>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm="6" className="mb-1">
            <Label for="CourseTypeId">{t("CourseTypeId")}</Label>
            <Controller
              name="CourseTypeId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseTypeId ? "is-invalid" : ""
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
                {errors.CourseTypeId.message}
              </div>
            )}
          </Col>

          <Col sm="6" className="mb-1">
            <Label for="CourseStatusId">{t("CourseStatusId")}</Label>
            <Controller
              name="CourseStatusId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.CourseStatusId ? "is-invalid" : ""
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
                {errors.CourseStatusId.message}
              </div>
            )}
          </Col>

          <Col sm="6" className="mb-1">
            <Label for="CourseLvlId">{t("CourseLvlId")}</Label>
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
                {errors.CourseLvlId.message}
              </div>
            )}
          </Col>

          <Col sm="6" className="mb-1">
            <Label for="ClassId">{t("CourseClassId")}</Label>
            <Controller
              name="ClassId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.ClassId ? "is-invalid" : ""
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
            {errors.ClassId && (
              <div className="invalid-feedback d-block">
                {errors.ClassId.message}
              </div>
            )}
          </Col>

          <Col sm="6" className="mb-1">
            <Label for="TeacherId">{t("CourseTeacherId")}</Label>
            <Controller
              name="TeacherId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.TeacherId ? "is-invalid" : ""
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
                {errors.TeacherId.message}
              </div>
            )}
          </Col>

          <Col sm="6" className="mb-1">
            <Label for="TremId">{t("CourseTremId")}</Label>
            <Controller
              name="TremId"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className={`react-select ${
                    errors.TremId ? "is-invalid" : ""
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
                {errors.TremId.message}
              </div>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="ShortLink">
              {t("CourseShortLink")}
            </Label>
            <Controller
              id="ShortLink"
              name="ShortLink"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t("CourseShortLinkPlaceholder")}
                  invalid={errors.ShortLink && true}
                  {...field}
                />
              )}
            />
            {errors.ShortLink && (
              <FormFeedback>{errors.ShortLink.message}</FormFeedback>
            )}
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="UniqeUrlString">
              {t("CourseUniqeUrlString")}
            </Label>
            <Controller
              id="UniqeUrlString"
              name="UniqeUrlString"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t("CourseUniqeUrlStringPlaceholder")}
                  invalid={errors.UniqeUrlString && true}
                  {...field}
                />
              )}
            />
            {errors.UniqeUrlString && (
              <FormFeedback>{errors.UniqeUrlString.message}</FormFeedback>
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

export default PersonalInfo;
