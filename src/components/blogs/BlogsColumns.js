import React, { useState } from "react";
import {
  Badge,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap";
import { Eye, Edit, MoreVertical, Power } from "react-feather";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { toggleBlogStatus } from "../../core/services/api/blogs/blogs.service";

const baseURL = import.meta.env.VITE_BASE_URL || "";
import defaultIMG from "../../assets/images/coursePng.png";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ row }) => {
  const { t } = useTranslation();
  const initStatus = row.isActive === true || row.active === true;
  const [isActive, setIsActive] = useState(initStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    const newsStatus = !isActive;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("Active", newsStatus);
    formData.append("Id", row.id);

    try {
      const result = await toggleBlogStatus(formData);
      if (result) {
        setIsActive(newsStatus);
        row.active = newsStatus;
        row.isActive = newsStatus;
        toast.success(
          newsStatus ? t("StatusUpdateSuccess") : t("StatusUpdateSuccessNot"),
        );
      } else {
        toast.error(t("StatusUpdateError"));
      }
    } catch (error) {
      toast.error(t("ServerError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <Link to={`/blogs/view/${row.id}`} className="text-body me-1">
        <Eye size={18} id={`blog-view-${row.id}`} />
        <UncontrolledTooltip placement="top" target={`blog-view-${row.id}`}>
          {t("EditArticle")}
        </UncontrolledTooltip>
      </Link>

      <Link to={`/blogs/edit/${row.id}`} className="text-body me-1">
        <Edit size={18} id={`blog-edit-${row.id}`} />
        <UncontrolledTooltip placement="top" target={`blog-edit-${row.id}`}>
          {t("EditArticle")}
        </UncontrolledTooltip>
      </Link>

      <UncontrolledDropdown>
        <DropdownToggle
          className="icon-btn hide-arrow cursor-pointer text-body p-0"
          tag="span"
          color="transparent"
        >
          {isLoading ? <Spinner size="sm" /> : <MoreVertical size={18} />}
        </DropdownToggle>

        <DropdownMenu end>
          <DropdownItem
            onClick={handleToggleStatus}
            className="w-100 d-flex align-items-center"
          >
            <Power size={14} className="me-50" />
            <span className="align-middle">
              {isActive ? t("Deactivate") : t("Activate")}
            </span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

const BlogsColumns = (t) => [
  {
    name: t("Article"),
    sortable: true,
    minWidth: "300px",
    selector: (row) => row.title,
    cell: (row) => {
      let imgSrc = defaultIMG;
      if (row.currentImageAddressTumb) {
        imgSrc = row.currentImageAddressTumb.startsWith("http")
          ? row.currentImageAddressTumb
          : `${baseURL}/${row.currentImageAddressTumb}`;
      }
      return (
        <Link
          to={`/blogs/view/${row.id}`}
          className="d-flex align-items-center text-decoration-none text-body"
        >
          <img
            src={imgSrc}
            alt={row.title}
            width="40"
            height="40"
            className="me-1 rounded"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultIMG;
            }}
          />
          <div className="d-flex flex-column">
            <span className="fw-bolder cursor-pointer text-primary">
              {row.title}
            </span>
            <small
              className="text-truncate text-muted mb-0"
              style={{ maxWidth: "200px" }}
            >
              {row.miniDescribe || t("NoDescription")}
            </small>
          </div>
        </Link>
      );
    },
  },
  {
    name: t("Category"),
    sortable: true,
    minWidth: "150px",
    selector: (row) => row.category?.categoryName || row.newsCategoryName,
    cell: (row) => (
      <span>
        {row.category?.categoryName || row.newsCategoryName || t("NoCategory")}
      </span>
    ),
  },
  {
    name: t("Views"),
    sortable: true,
    selector: (row) => row.currentView,
    cell: (row) => (
      <span className="text-primary fw-bold">{row.currentView}</span>
    ),
  },
  {
    name: t("Status"),
    sortable: true,
    minWidth: "100px",
    selector: (row) => row.active,
    cell: (row) => {
      const isActive = row.isActive === true || row.active === true;
      return (
        <Badge
          color={isActive ? "light-success" : "light-primary"}
          pill
          className="px-1 py-50"
        >
          {isActive ? t("Active") : t("Inactive")}
        </Badge>
      );
    },
  },
  {
    name: t("Actions"),
    minWidth: "150px",

    cell: (row) => <ActionsCell row={row} />,
  },
];

export default BlogsColumns;
