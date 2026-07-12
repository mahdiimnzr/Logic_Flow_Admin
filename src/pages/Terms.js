import React, { Fragment, useEffect } from "react";
import Spinner from "@components/spinner/Fallback-spinner";
import { useTranslation } from "react-i18next";
import {
  useGetDepartments,
  useGetTerm,
} from "../core/services/api/ManagementCourses/ManagementCourses.service";

// ** User List Component
import Table from "../components/ManagementCourses/terms/Table";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

// ** Icons Imports
import {
  User,
  UserPlus,
  UserCheck,
  UserX,
  Globe,
  Activity,
  Slash,
} from "react-feather";

// ** Styles
import "@styles/react/apps/app-users.scss";

const Terms = () => {
  const { t } = useTranslation();
  const { isLoading, data: termList, isFetching } = useGetTerm();
  const { isLoading: departmentsLoading } = useGetDepartments();

  const totalExpire = termList?.data?.filter((value) => value.expire == true);
  const totalUnExpire = termList?.data?.filter(
    (value) => value.expire == false,
  );

  return isLoading || departmentsLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="app-user-list">
        <Row>
          <Col lg="4" sm="7">
            <StatsHorizontal
              color="primary"
              statTitle="کل ترم ها"
              icon={<Globe size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">{termList?.data?.length}</h3>
              }
            />
          </Col>
          <Col lg="4" sm="6">
            <StatsHorizontal
              color="success"
              statTitle="ترم های منقضی نشده"
              icon={<Activity size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">{totalUnExpire?.length}</h3>
              }
            />
          </Col>
          <Col lg="4" sm="6">
            <StatsHorizontal
              color="danger"
              statTitle="ترم های منقضی شده"
              icon={<Slash size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">{totalExpire?.length}</h3>
              }
            />
          </Col>
        </Row>
        <Table termList={termList?.data} isFetching={isFetching} />
      </div>
    </Fragment>
  );
};

export default Terms;
