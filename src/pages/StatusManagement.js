import { Fragment, useState } from "react";
import Spinner from "../@core/components/spinner/Fallback-spinner";
import Table from "../components/ManagementCourses/StatusManagement/Table";
import { Button, Col, Row } from "reactstrap";
import SubscribersGained from "../components/ManagementCourses/StatusManagement/SubscribersGained";
import { useTranslation } from "react-i18next";
import StatusSideBar from "../components/ManagementCourses/StatusManagement/StatusSideBar";
import Breadcrumbs from "@components/breadcrumbs";
import { useGetStatus } from "../core/services/api/ManagementCourses/ManagementCourses.service";

const StatusManagement = () => {
  const { isLoading, data: Status, isFetching } = useGetStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title={t("StatusManagement")}
        data={[
          { title: t("Courses") },
          { title: t("StatusManagement") },
        ]}
      />

      <Row>
        <Col lg="3" sm="6">
          <SubscribersGained
            title={t("TotalStatuses")}
            subscribers={Status?.data?.length || 0}
            series={[
              {
                name: t("Statuses"),
                data: [0, 25, 15, 50, 35, 70, Status?.data?.length || 0],
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
              {t("AddStatus")}
            </Button>
          </div>
        </Col>

        <Col xl="9" sm="12">
          <div className="app-user-list">
            <Table Status={Status?.data} isFetching={isFetching} />
          </div>
        </Col>
      </Row>

      <StatusSideBar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default StatusManagement;