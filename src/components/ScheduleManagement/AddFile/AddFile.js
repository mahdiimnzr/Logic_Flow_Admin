import React, { useState } from "react";
import AddFileTabs from "./AddFileTabs";
import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  TabContent,
  TabPane,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import EasyFile from "./EasyFile";
import FileUpload from "./FileUpload";

const AddFile = ({ isOpen, setIsOpen, statusProp }) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)}>
        {t("AddFile")}
      </ModalHeader>

      <ModalBody>
        <Col>
          <AddFileTabs
            className="mb-2"
            activeTab={activeTab}
            toggleTab={toggleTab}
          />

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <FileUpload
                statusProp={statusProp}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </TabPane>
          </TabContent>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="2">
              <EasyFile
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                statusProp={statusProp}
              />
            </TabPane>
          </TabContent>
        </Col>
      </ModalBody>
    </Modal>
  );
};

export default AddFile;
