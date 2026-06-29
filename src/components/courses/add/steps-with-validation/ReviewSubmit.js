import { Fragment } from "react";
import { ArrowLeft } from "react-feather";
import { Row, Col, Button, Badge, Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import formDataConverter from "../../../../core/utils/formDataConvertor";
import formatDate from "../../../../core/utils/formatDate";
import {
  useGetCourseAdd,
  createCourseStepTwo,
  addCourseTechnology,
} from "../../../../core/services/api/CourseList/courseList.service";
import { useNavigate } from "react-router-dom";

const ReviewSubmit = ({ stepper }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useSelector((state) => state.addCourseSlice.params);
  const { data: courseAdd } = useGetCourseAdd();

  const courseTypeName = courseAdd?.data?.courseTypeDtos?.find(
    (item) => item.id == params.CourseTypeId,
  )?.typeName;

  const statusName = courseAdd?.data?.statusDtos?.find(
    (item) => item.id == params.CourseStatusId,
  )?.statusName;

  const levelName = courseAdd?.data?.courseLevelDtos?.find(
    (item) => item.id == params.CourseLvlId,
  )?.levelName;

  const classRoomName = courseAdd?.data?.classRoomDtos?.find(
    (item) => item.id == params.ClassId,
  )?.classRoomName;

  const teacherName = courseAdd?.data?.teachers?.find(
    (item) => item.teacherId == params.TeacherId,
  )?.fullName;

  const termName = courseAdd?.data?.termDtos?.find(
    (item) => item.id == params.TremId,
  )?.termName;

  const technologyNames = params.TechnologyIds?.map(
    (tech) =>
      courseAdd?.data?.technologyDtos?.find((item) => item.id == tech.techId)
        ?.techName,
  );

  const { mutate: addTechnologies, isPending: isTechPending } = useMutation({
    mutationFn: ({ courseId, technologies }) =>
      addCourseTechnology({ courseId, body: technologies }),
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/Courses/List")
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (response) => {
      toast.error(response?.data?.message ?? t("ErrorOccurred"));
    },
  });

  const { mutate: submitCourse, isPending: isCoursePending } = useMutation({
    mutationFn: createCourseStepTwo,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        const courseId = response.data.id;
        addTechnologies({
          courseId,
          technologies: params.TechnologyIds,
        });
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response?.data?.message ?? t("ErrorOccurred"), {
        id: context.toastId,
      });
    },
  });

  const onSubmit = () => {
    const { TechnologyIds, ...courseParams } = params;
    const formData = formDataConverter(courseParams);
    submitCourse(formData);
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">{t("ReviewCourse")}</h5>
        <small className="text-muted">{t("ReviewCourseSubtitle")}</small>
      </div>

      <div className="mt-2">
        <div className="mb-2">
          <h6 className="fw-bold border-bottom pb-50 mb-1 text-primary">
            {t("AddCourseInfo")}
          </h6>
          <Row>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseTitle")}:{" "}
              </span>
              <span>{params.Title}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseMiniDescribe")}:{" "}
              </span>
              <span>{params.MiniDescribe}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseCost")}:{" "}
              </span>
              <span>{params.Cost}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseCurrentPaymentNumber")}:{" "}
              </span>
              <span>{params.CurrentCoursePaymentNumber}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseCapacity")}:{" "}
              </span>
              <span>{params.Capacity}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseSessionNumber")}:{" "}
              </span>
              <span>{params.SessionNumber}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseStartTime")}:{" "}
              </span>
              <span>
                {params.StartTime ? formatDate(params.StartTime) : "—"}
              </span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseEndTime")}:{" "}
              </span>
              <span>{params.EndTime ? formatDate(params.EndTime) : "—"}</span>
            </Col>
            <Col md="12" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseDescribe")}:{" "}
              </span>
              <p className="mt-25">{params.Describe}</p>
            </Col>
          </Row>
        </div>

        <div className="mb-2">
          <h6 className="fw-bold border-bottom pb-50 mb-1 text-primary">
            {t("AddCourseDetails")}
          </h6>
          <Row>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseTypeId")}:{" "}
              </span>
              <span>{courseTypeName}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseStatusId")}:{" "}
              </span>
              <span>{statusName}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseLvlId")}:{" "}
              </span>
              <span>{levelName}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseClassId")}:{" "}
              </span>
              <span>{classRoomName}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseTeacherId")}:{" "}
              </span>
              <span>{teacherName}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseTremId")}:{" "}
              </span>
              <span>{termName}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseShortLink")}:{" "}
              </span>
              <span>{params.ShortLink}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseUniqeUrlString")}:{" "}
              </span>
              <span>{params.UniqeUrlString}</span>
            </Col>
          </Row>
        </div>

        <div className="mb-2">
          <h6 className="fw-bold border-bottom pb-50 mb-1 text-primary">
            {t("AddCourseSeoDetails")}
          </h6>
          <Row>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseGoogleTitle")}:{" "}
              </span>
              <span>{params.GoogleTitle}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseGoogleSchema")}:{" "}
              </span>
              <span>{params.GoogleSchema}</span>
            </Col>
            <Col md="6" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CoursePrerequisiteId")}:{" "}
              </span>
              <span>{params.CoursePrerequisiteId}</span>
            </Col>
            <Col md="12" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseImageAddress")}:{" "}
              </span>
              {params.Image ? (
                <div className="mt-50">
                  <img
                    src={URL.createObjectURL(params.Image)}
                    alt="course"
                    style={{
                      maxHeight: 160,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <span className="text-danger">—</span>
              )}
            </Col>
          </Row>
        </div>

        <div className="mb-2">
          <h6 className="fw-bold border-bottom pb-50 mb-1 text-primary">
            {t("AddCourseTechCategory")}
          </h6>
          <Row>
            <Col md="12" className="mb-75">
              <span className="fw-bold text-muted small">
                {t("CourseTechnologyId")}:{" "}
              </span>
              <div className="d-flex flex-wrap gap-50 mt-50">
                {technologyNames?.length > 0 ? (
                  technologyNames.map((name, index) => (
                    <Badge key={index} color="light-primary" pill>
                      {name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-danger">—</span>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-2">
        <Button
          type="button"
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
          disabled={isCoursePending || isTechPending}
        >
          <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
          <span className="align-middle d-sm-inline-block d-none">
            {t("Previous")}
          </span>
        </Button>
        <Button
          type="button"
          color="success"
          disabled={isCoursePending || isTechPending}
          onClick={onSubmit}
        >
          {(isCoursePending || isTechPending) && (
            <Spinner size="sm" className="me-50" />
          )}
          {t("CreateCourse")}
        </Button>
      </div>
    </Fragment>
  );
};

export default ReviewSubmit;
