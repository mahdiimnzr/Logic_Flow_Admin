import { Fragment, useState } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Table from "../components/ManagementCourses/LevelManagement/Table";
import { Button, Col, Row } from "reactstrap";
import SubscribersGained from "../components/ManagementCourses/LevelManagement/SubscribersGained";
import { useTranslation } from "react-i18next";
import LevelSideBar from "../components/ManagementCourses/LevelManagement/LevelSideBar";
import Breadcrumbs from "@components/breadcrumbs";
import { useGetCourseLevel } from "../core/services/api/ManagementCourses/ManagementCourses.service";

const LevelManagement = () => {
  const { isLoading, data: CourseLevel } = useGetCourseLevel();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // ** I18n
  const { t } = useTranslation();

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title="مدیریت دوره ها"
        data={[{ title: "  دوره ها" }, { title: "مدیریت دوره ها" }]}
      />
      <Row>
        <Col lg="3" sm="6">
          <SubscribersGained
            title="مجموع سطح دوره ها"
            subscribers={CourseLevel?.data?.length || 0}
            series={[
              {
                name: "تکنولوژی ها",
                data: [0, 25, 15, 50, 35, 70, CourseLevel?.data?.length || 0],
              },
            ]}
          />

          <div className="d-flex align-items-center table-header-actions">
            <Button
              block
              className="add-new-user"
              color="primary"
              onClick={toggleSidebar}
            >
              {" "}
              افزودن سطح دوره ها
            </Button>
          </div>
        </Col>
        <Col xl="9" sm="12">
          <div className="app-user-list">
            <Table CourseLevel={CourseLevel?.data} />
          </div>
        </Col>
      </Row>
      <LevelSideBar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default LevelManagement;
