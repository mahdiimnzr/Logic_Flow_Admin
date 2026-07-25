import { Link } from "react-router-dom";
import Avatar from "@components/avatar";
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { useGetCurrentUserDetail } from "../../../../core/services/api/dashboard/dashboard.service";

const UserDropdown = () => {
  const { isLoading: userLoading, data } = useGetCurrentUserDetail();
  return (
    !userLoading && (
      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
        <DropdownToggle
          href="/"
          tag="a"
          className="nav-link dropdown-user-link"
          onClick={(e) => e.preventDefault()}
        >
          <div className="user-nav d-sm-flex d-none">
            <span className="user-name fw-bold">{`${data?.data?.fName}  ${data?.data?.lName}`}</span>
            <span className="user-status">Admin</span>
          </div>
          <Avatar
            img={data?.data?.currentPictureAddress || defaultAvatar}
            imgHeight="40"
            imgWidth="40"
            status="online"
          />
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem
            tag={Link}
            to="/Auth/Login"
            onClick={() => localStorage.removeItem("token")}
          >
            <Power size={14} className="me-75" />
            <span className="align-middle">Logout</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  );
};

export default UserDropdown;
