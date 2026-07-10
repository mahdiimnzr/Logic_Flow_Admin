import { Fragment, useState } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Table from "../components/ManagementCourses/TechnologyManagement/Table";
import { Button, Col, Row } from "reactstrap";
import SubscribersGained from "../components/ManagementCourses/TechnologyManagement/SubscribersGained";
import { useTranslation } from "react-i18next";
import SidebarNewUsers from "../components/ManagementCourses/TechnologyManagement/TechSideBar";
import Breadcrumbs from "@components/breadcrumbs";
import { useGetTechnology } from "../core/services/api/ManagementCourses/ManagementCourses.service";

const TechnologyManagement = () => {
  const { isLoading, data: technology, isFetching } = useGetTechnology();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("TechnologyManagement")}
        data={[
          { title: t("Courses") },
          { title: t("TechnologyManagement") },
        ]}
      />

      <Row>
        <Col lg="3" sm="6">
          <SubscribersGained
            title={t("TotalTechnologies")}
            subscribers={technology?.data?.length || 0}
            series={[
              {
                name: t("Technologies"),
                data: [0, 25, 15, 50, 35, 70, technology?.data?.length || 0],
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
              {t("AddTechnology")}
            </Button>
          </div>
        </Col>

        <Col xl="9" sm="12">
          <div className="app-user-list">
            <Table technology={technology?.data} isFetching={isFetching} />
          </div>
        </Col>
      </Row>

      <SidebarNewUsers open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default TechnologyManagement;