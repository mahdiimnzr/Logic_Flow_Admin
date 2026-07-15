import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@components/breadcrumbs";
import { Row, Col } from "reactstrap";

import SessionTabs from "../components/session/detail/SessionTabs";
import AddHomeworkSidebar from "../components/session/detail/AddHomeworkSidebar";
import AddSessionFileSidebar from "../components/session/detail/AddSessionFileSidebar";

const SessionDetail = () => {
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState("1");

  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const toggleHomeworkModal = () => setIsHomeworkModalOpen(!isHomeworkModalOpen);
  const toggleFileModal = () => setIsFileModalOpen(!isFileModalOpen);

  return (
    <Fragment>
      <Breadcrumbs
        title="جزئیات جلسه"
        data={[
          { title: "لیست جلسات", link: "/session/list" },
          { title: "جزئیات جلسه" },
        ]}
      />

      <div className="app-user-view">
        <Row>
          <Col xl="12" lg="12" xs="12">
            <SessionTabs 
              activeTab={activeTab} 
              toggleTab={toggleTab} 
              sessionId={id}
              toggleHomeworkModal={toggleHomeworkModal}
              toggleFileModal={toggleFileModal}
            />
          </Col>
        </Row>

        <AddHomeworkSidebar 
          isOpen={isHomeworkModalOpen} 
          toggle={toggleHomeworkModal} 
          sessionId={id} 
        />
        
        <AddSessionFileSidebar 
          isOpen={isFileModalOpen} 
          toggle={toggleFileModal} 
          sessionId={id} 
        />
      </div>
    </Fragment>
  );
};

export default SessionDetail;