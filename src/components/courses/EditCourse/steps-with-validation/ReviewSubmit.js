import { Fragment } from "react";
import { ArrowLeft } from "react-feather";
import { Row, Col, Button, Badge, Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import formDataConverter from "../../../../core/utils/formDataConvertor";
import formatDate from "../../../../core/utils/formatDate";
import { useNavigate, useParams } from "react-router-dom";
import { updateCourseDetail } from "../../../../core/services/api/CourseList/courseList.service";
import HandleIdentityEditorJs from "../../../common/EditorDetailValidation";

const ReviewSubmit = ({ stepper, usersList }) => {
  const { courseId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useSelector((state) => state.editCourseSlice.params);
  const CourseLevels = queryClient.getQueryState(["CourseLevels"]);
  const CourseStatus = queryClient.getQueryState(["CourseStatus"]);
  const CourseTypes = queryClient.getQueryState(["CourseTypes"]);
  const CourseTerms = queryClient.getQueryState(["CourseTerms"]);
  const CourseClassRoom = queryClient.getQueryState(["CourseClassRoom"]);
  const teachers = usersList?.listUser?.filter((value) =>
    value.userRoles.includes("teacher"),
  );

  const courseTypeName = CourseTypes?.data?.data?.find(
    (item) => item.id == params.CourseTypeId,
  )?.typeName;

  const statusName = CourseStatus?.data?.data?.find(
    (item) => item.id == params.CourseStatusId,
  )?.statusName;

  const levelName = CourseLevels?.data?.data?.find(
    (item) => item.id == params.CourseLvlId,
  )?.levelName;

  const classRoomName = CourseClassRoom?.data?.data?.find(
    (item) => item.id == params.ClassId,
  )?.classRoomName;

  const teacherName =
    teachers?.find((item) => item.id == params.TeacherId)?.fName +
    " " +
    teachers?.find((item) => item.id == params.TeacherId)?.lName;

  const termName = CourseTerms?.data?.data?.find(
    (item) => item.id == params.TremId,
  )?.termName;

  const { mutate: updateCourseMutate, iePending } = useMutation({
    mutationFn: updateCourseDetail,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`CourseDetail-${courseId}`],
        });
        navigate(`/Courses/Detail/${courseId}`);
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const onSubmit = () => {
    const data = { Id: courseId, ...params };
    const formData = formDataConverter(data);
    updateCourseMutate(formData);
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
              <HandleIdentityEditorJs desc={params.Describe} />
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
              {params.imageAddress ? (
                <div className="mt-50">
                  <img
                    src={params.imageAddress}
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
      </div>

      <div className="d-flex justify-content-between mt-2">
        <Button
          type="button"
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
          disabled={iePending}
        >
          <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
          <span className="align-middle d-sm-inline-block d-none">
            {t("Previous")}
          </span>
        </Button>
        <Button
          type="button"
          color="success"
          disabled={iePending}
          onClick={onSubmit}
        >
          {iePending && <Spinner size="sm" className="me-50" />}
          {t("EditCourse")}
        </Button>
      </div>
    </Fragment>
  );
};

export default ReviewSubmit;
