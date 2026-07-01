import { Row, Col, TabContent, TabPane } from "reactstrap";
import PreviewCard from "../components/courses/courseDetail/PreviewCard";
import "@styles/base/pages/app-invoice.scss";
import {
  useGetCourseDetail,
  useGetCourseGroup,
  useGetCourseReserve,
  useGetCourseSocialMedias,
  useGetCourseAssistance,
  useGetAssistanceWork,
  useGetStatus,
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
import PaymentList from "../components/courses/courseDetail/coursePayments/Table";
import SocialGroupList from "../components/courses/courseDetail/courseSocialGroups/Table";
import MentorList from "../components/courses/courseDetail/courseMentors/Table";
import MentorWorksList from "../components/courses/courseDetail/courseMentorWorks/Table";
import { useGetUserList } from "../core/services/api/Users/users.service";
import { useGetTechnology } from "../core/services/api/TechnologyManagement/Technology.service";

const CoursesDetail = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  const { isLoading: statusLoading } = useGetStatus();
  const { isLoading: categoryLoading } = useGetTechnology();
  const { isLoading, data: courseDetail } = useGetCourseDetail(courseId);
  const { isLoading: usersLoading } = useGetUserList({ RowsOfPage: 1000 });

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

  const { isLoading: courseSocialGroupLoading, data: courseSocialGroup } =
    useGetCourseSocialMedias();

  const { isLoading: courseMentorsLoading, data: courseMentors } =
    useGetCourseAssistance();

  const { isLoading: assistanceWorkLoading, data: assistanceWork } =
    useGetAssistanceWork();

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
    [courseComments, courseId],
  );

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return isLoading ||
    commentsLoading ||
    reservesLoading ||
    courseGroupLoading ||
    courseSocialGroupLoading ||
    courseMentorsLoading ||
    assistanceWorkLoading ||
    usersLoading ||
    statusLoading ||
    categoryLoading ? (
    <Spinner />
  ) : (
    <div className="invoice-preview-wrapper">
      <Row className="invoice-preview">
        <Col xl={3} sm={12}>
          <PreviewCard courseDetail={courseDetail?.data} />
        </Col>
        <Col xl={9} sm={12}>
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
          <TabContent activeTab={activeTab}>
            <TabPane tabId="5">
              <div className="app-user-list">
                <PaymentList data={courseDetail?.data} />
              </div>
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="6">
              <div className="app-user-list">
                <SocialGroupList data={courseSocialGroup?.data} />
              </div>
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="7">
              <div className="app-user-list">
                <MentorList data={courseMentors?.data} />
              </div>
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="8">
              <div className="app-user-list">
                <MentorWorksList
                  data={assistanceWork?.data}
                  mentors={courseMentors?.data}
                />
              </div>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default CoursesDetail;
