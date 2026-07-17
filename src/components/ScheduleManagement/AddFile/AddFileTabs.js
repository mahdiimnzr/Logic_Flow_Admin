import React from "react";
import { Image, Send } from "react-feather";
import { Nav, NavItem, NavLink } from "reactstrap";
import { useTranslation } from "react-i18next";

const AddFileTabs = ({ toggleTab, activeTab }) => {
  const { t } = useTranslation();

  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <Image size={18} className="me-50" />
          <span className="fw-bold">{t("SendFile")}</span>
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <Send size={18} className="me-50" />
          <span className="fw-bold">{t("SendUrl")}</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default AddFileTabs;
