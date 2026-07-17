import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { List, User, Clock } from "react-feather";

const TicketTabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")} className="cursor-pointer">
          <List size={16} className="me-50" />
          <span className="fw-bold">همه تیکت‌ها</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")} className="cursor-pointer">
          <User size={16} className="me-50" />
          <span className="fw-bold">تیکت‌های من</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")} className="cursor-pointer">
          <Clock size={16} className="me-50" />
          <span className="fw-bold">در انتظار پشتیبان</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default TicketTabs;