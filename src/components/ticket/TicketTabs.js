import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { List, User, Clock } from "react-feather";
import { useTranslation } from "react-i18next";

const TicketTabs = ({ activeTab, toggleTab }) => {
  const { t } = useTranslation();
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink
          active={activeTab === "1"}
          onClick={() => toggleTab("1")}
          className="cursor-pointer"
        >
          <List size={16} className="me-50" />
          <span className="fw-bold">{t("AllTickets")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={activeTab === "2"}
          onClick={() => toggleTab("2")}
          className="cursor-pointer"
        >
          <User size={16} className="me-50" />
          <span className="fw-bold">{t("MyTickets")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={activeTab === "3"}
          onClick={() => toggleTab("3")}
          className="cursor-pointer"
        >
          <Clock size={16} className="me-50" />
          <span className="fw-bold">{t("SupporterPending")}</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default TicketTabs;
