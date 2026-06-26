// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import { User, Bell, Book, Briefcase } from "react-feather";
import { useTranslation } from "react-i18next";

const Tabs = ({ activeTab, toggleTab }) => {
  const { t } = useTranslation();
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <User size={18} className="me-50" />
          <span className="fw-bold">{t("ProfileDetails")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <Briefcase size={18} className="me-50" />
          <span className="fw-bold">{t("UserCourses")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
          <Book size={18} className="me-50" />
          <span className="fw-bold">{t("UserReserveCourses")}</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Tabs;
