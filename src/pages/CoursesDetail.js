import { Row, Col, Alert } from "reactstrap";
import PreviewCard from "../components/courses/courseDetail/PreviewCard";
import PreviewActions from "../components/courses/courseDetail/PreviewActions";
import "@styles/base/pages/app-invoice.scss";
import { useGetCourseDetail } from "../core/services/api/CourseList/courseList.service";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Spinner from "@components/spinner/Fallback-spinner";
import { useParams } from "react-router-dom";

const CoursesDetail = () => {
  const { courseId } = useParams();

  const { isLoading, data: courseDetail } = useGetCourseDetail(courseId);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="invoice-preview-wrapper">
      <Row className="invoice-preview">
        <Col xl={4} md={8} sm={12}>
          <PreviewCard courseDetail={courseDetail?.data} />
        </Col>
      </Row>
    </div>
  );
};

export default CoursesDetail;
