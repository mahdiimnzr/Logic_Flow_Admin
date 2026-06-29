// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import { Menu, Bell, Book, Send, Package } from "react-feather";
import { useTranslation } from "react-i18next";

const CourseDetailTabs = ({ activeTab, toggleTab }) => {
  const { t } = useTranslation();
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <Menu size={18} className="me-50" />
          <span className="fw-bold">{t("CourseDetail")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <Send size={18} className="me-50" />
          <span className="fw-bold">{t("Comments")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
          <Book size={18} className="me-50" />
          <span className="fw-bold">{t("Reserves")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
          <Package size={18} className="me-50" />
          <span className="fw-bold">{t("Groups")}</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default CourseDetailTabs;
