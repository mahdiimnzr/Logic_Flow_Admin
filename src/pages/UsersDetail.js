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
import AccountSetting from "../components/usersDetail/AccountSetting";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { useGetUserDetail } from "../core/services/api/Users/users.service";
import { useParams } from "react-router-dom";

const UsersDetail = () => {
  const { userId } = useParams();
  // ** States
  const [activeTab, setActiveTab] = useState("1");

  const { isLoading, data: userDetail } = useGetUserDetail(userId);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Breadcrumbs
        title="Account Settings"
        data={[{ title: "Pages" }, { title: "Account Settings" }]}
      />
      {/* {data !== null ? ( */}
      {/* <Row> */}
      {/* <Col xs={12}> */}
      {/* <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            /> */}

      {/* <TabContent activeTab={activeTab}>
              <TabPane tabId="1"> */}
      <AccountSetting data={userDetail?.data} />
      {/* </TabPane>
            </TabContent> */}
      {/* </Col> */}
      {/* </Row> */}
      {/* //   ) : null} */}
    </Fragment>
  );
};

export default UsersDetail;
