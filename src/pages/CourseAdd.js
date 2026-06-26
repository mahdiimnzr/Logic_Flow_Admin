// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import axios from "axios";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";

// ** Demo Components
import Spinner from "@components/spinner/Fallback-spinner";

// import Tabs from "./Tabs";
import Breadcrumbs from "@components/breadcrumbs";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
// import { useTranslation } from "react-i18next";
import Tabs from "../components/courses/add/Tabs";
import UserCourses from "../components/courses/add/UserCourses";
import UserReserveCourses from "../components/courses/add/UserReserveCourses";
import { useGetCourseAdd } from "../core/services/api/CourseList/courseList.service";
import AccountSetting from "../components/courses/add/AccountSetting";

const CourseAdd = () => {
  //   const { t } = useTranslation();

  // ** States
  const [activeTab, setActiveTab] = useState("1");

  const { isLoading } = useGetCourseAdd();

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      {/* <Breadcrumbs
        title={t("ProfileDetails")}
        data={[
          { title: t("Users"), link: "/Users/List" },
          { title: t("ProfileDetails") },
        ]}
      /> */}
      {/* {userDetail?.data !== null ? ( */}
      <Row>
        <Col xs={13}>
          <Tabs className="mb-2" activeTab={activeTab} toggleTab={toggleTab} />
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <AccountSetting />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="2">{/* <UserCourses /> */}</TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="3">{/* <UserReserveCourses /> */}</TabPane>
          </TabContent>
        </Col>
      </Row>
      {/* ) : null} */}
    </Fragment>
  );
};

export default CourseAdd;
