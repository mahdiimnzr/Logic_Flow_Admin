import { Row, Col, TabContent, TabPane } from "reactstrap";
import PreviewCard from "../components/courses/courseDetail/PreviewCard";
import "@styles/base/pages/app-invoice.scss";
import {
  useGetCourseDetail,
  useGetCourseGroup,
  useGetCourseReserve,
} from "../core/services/api/CourseList/courseList.service";
import { useState, useMemo } from "react";
import Spinner from "@components/spinner/Fallback-spinner";
import { useParams } from "react-router-dom";
import CourseDetail from "../components/courses/courseDetail/detailTabs/CourseDetail";
import CourseDetailTabs from "../components/courses/courseDetail/Tabs";
import CommentsList from "../components/courses/courseDetail/courseComments/Table";
import { useGetCourseCommentsList } from "../core/services/api/Comments/comments.service";
import ReserveTabs from "../components/courses/courseDetail/courseReservesTabs/Table";
import GroupsList from "../components/courses/courseDetail/courseGroup/Table";

const CoursesDetail = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  const { isLoading, data: courseDetail } = useGetCourseDetail(courseId);

  const { isLoading: commentsLoading, data: courseComments } =
    useGetCourseCommentsList({ RowsOfPage: "1000" });

  const { isLoading: reservesLoading, data: courseReserves } =
    useGetCourseReserve(courseId);

  const { isLoading: courseGroupLoading, data: courseGroup } =
    useGetCourseGroup(
      {
        TeacherId: courseDetail?.data?.teacherId,
        CourseId: courseId,
      },
      {
        enabled: !!courseDetail?.data?.teacherId,
      },
    );

  const reserveCourseWithGroup = courseReserves?.data?.map((value) => ({
    ...value,
    groupId: courseGroup?.data,
  }));

  const courseGroupWithTeacher = courseGroup?.data?.map((value) => ({
    ...value,
    teacherName: courseDetail?.data?.teacherName,
  }));

  const thisCourseComments = useMemo(
    () =>
      courseComments?.data?.comments?.filter(
        (value) => value.courseId == courseId,
      ),
    [courseComments],
  );

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return isLoading ||
    commentsLoading ||
    reservesLoading ||
    courseGroupLoading ? (
    <Spinner />
  ) : (
    <div className="invoice-preview-wrapper">
      <Row className="invoice-preview">
        <Col xl={4} sm={12}>
          <PreviewCard courseDetail={courseDetail?.data} />
        </Col>
        <Col xl={8} sm={12}>
          <CourseDetailTabs
            className="mb-2"
            activeTab={activeTab}
            toggleTab={toggleTab}
          />
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <CourseDetail data={courseDetail?.data} />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="2">
              <div className="app-user-list">
                <CommentsList data={thisCourseComments} />
              </div>
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="3">
              <div className="app-user-list">
                <ReserveTabs data={reserveCourseWithGroup} />
              </div>
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="4">
              <div className="app-user-list">
                <GroupsList data={courseGroupWithTeacher} />
              </div>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default CoursesDetail;
