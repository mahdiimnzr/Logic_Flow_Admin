import { Fragment, useEffect, useState } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Table from "../components/ManagementCourses/DepartmentsManagement/Table";
import { Button, Col, Row } from "reactstrap";
import { kFormatter } from "@utils";
import SubscribersGained from "../components/ManagementCourses/DepartmentsManagement/SubscribersGained";
import { useTranslation } from "react-i18next";
import SidebarNewUsers from "../components/ManagementCourses/DepartmentsManagement/TechSideBar";
import Breadcrumbs from "@components/breadcrumbs";
import { useGetTechnology } from "../core/services/api/ManagementCourses/ManagementCourses.service";

const DepartmentsManagement = () => {
  const { isLoading, data: technology } = useGetTechnology();
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
            title="مجموع تکنولوژی ها"
            subscribers={technology?.data?.length || 0}
            series={[
              {
                name: "تکنولوژی ها",
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
              اضافه کردن تکنولوژی
            </Button>
          </div>
        </Col>
        <Col xl="9" sm="12">
          <div className="app-user-list">
            <Table technology={technology?.data} />
          </div>
        </Col>
      </Row>
      <SidebarNewUsers open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default DepartmentsManagement;
