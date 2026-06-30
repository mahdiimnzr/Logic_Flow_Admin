import { Nav, NavItem, NavLink } from "reactstrap";
import {
  Menu,
  Bell,
  Book,
  Send,
  Package,
  CreditCard,
  Users,
  UserCheck,
} from "react-feather";
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
      <NavItem>
        <NavLink active={activeTab === "5"} onClick={() => toggleTab("5")}>
          <CreditCard size={18} className="me-50" />
          <span className="fw-bold">{t("Payments")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "6"} onClick={() => toggleTab("6")}>
          <Users size={18} className="me-50" />
          <span className="fw-bold">{t("SocialGroups")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "7"} onClick={() => toggleTab("7")}>
          <UserCheck size={18} className="me-50" />
          <span className="fw-bold">{t("Mentors")}</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default CourseDetailTabs;
