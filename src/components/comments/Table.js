// ** React Imports
import { Fragment, useState, useEffect, useMemo } from "react";

// ** Table Columns
import { columns } from "./Columns";

// ** Debounce Search
import debounce from "debounce";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";
import { updateCommentCourseListParams } from "../../redux/actions";
import { useDispatch } from "react-redux";

// ** Table Header
const CustomHeader = ({
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  // ** I18n
  const { t } = useTranslation();

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center w-100">
            <label htmlFor="rows-per-page">{t("Show")}</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </Input>
            <label htmlFor="rows-per-page">{t("Entries")}</label>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center">
            <label className="mb-0" htmlFor="search-invoice">
              {t("Search")}
            </label>
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

const CommentsList = ({ commentsList, usersList }) => {
  // ** Redux
  const dispatch = useDispatch();

  // ** I18n
  const { t } = useTranslation();

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState({
    value: "",
    label: t("TeachersSelection"),
  });
  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: t("StatusSelection"),
  });
  const [currentUser, setCurrentUser] = useState({
    value: "",
    label: t("UsersSelection"),
  });

  // ** Page Count
  const count = Number(Math.ceil(commentsList?.totalCount / rowsPerPage));

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ** Handle Search
  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const search = value.trim() === "" ? null : value.trim();
        dispatch(
          updateCommentCourseListParams({ key: "Query", value: search }),
        );
      }, 1000),
    [dispatch],
  );

  // ** User filter options
  const teachers = usersList?.listUser?.filter((value) =>
    value.userRoles.includes("teacher"),
  );
  const teachersList = teachers?.map((value) => {
    const teachers = {
      value: value.id,
      label: value.fName + " " + value.lName,
    };
    return teachers;
  });

  const teachersOptions = [
    { value: null, label: t("TeachersSelection"), number: 0 },
    ...(teachersList ?? []),
  ];

  const usersLists = usersList?.listUser?.map((value) => {
    const users = { value: value.id, label: value.fName + " " + value.lName };
    return users;
  });

  const usersOptions = [
    { value: null, label: t("UsersSelection"), number: 0 },
    ...(usersLists ?? []),
  ];

  const statusOptions = [
    { value: null, label: t("StatusSelection") },
    { value: "accept", label: t("Accept") },
    { value: "notAccept", label: t("NotAccept") },
  ];

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      updateCommentCourseListParams({
        key: "PageNumber",
        value: page.selected + 1,
      }),
    );
    setCurrentPage(page.selected + 1);
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      updateCommentCourseListParams({
        key: "RowsOfPage",
        value: e.currentTarget.value,
      }),
    );
    setRowsPerPage(value);
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
    handleSearch(val);
  };

  // ** Update Current Page If That Page Doesn`t Exist
  useEffect(() => {
    if (currentPage > count) {
      dispatch(
        updateCommentCourseListParams({ key: "PageNumber", value: count || 1 }),
      );
      setCurrentPage(count || 1);
    }
  }, [count]);
  // ** Custom Pagination
  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{t("Filters")}</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <Label for="role-select">{t("Teachers")}</Label>
              <Select
                isClearable={false}
                value={currentTeacher}
                options={teachersOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentTeacher(data);
                  dispatch(
                    updateCommentCourseListParams({
                      key: "TeacherId",
                      value: data.value,
                    }),
                  );
                }}
              />
            </Col>
            <Col md="4">
              <Label for="delete-select">{t("Users")}</Label>
              <Select
                isClearable={false}
                value={currentUser}
                options={usersOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentUser(data);
                  dispatch(
                    updateCommentCourseListParams({
                      key: "userId",
                      value: data.value,
                    }),
                  );
                }}
              />
            </Col>
            <Col md="4">
              <Label for="status-select">{t("Status")}</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={statusOptions}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentStatus(data);
                  const value =
                    data.value === "accept"
                      ? true
                      : data.value === "notAccept"
                      ? false
                      : data.value;
                  dispatch(
                    updateCommentCourseListParams({
                      key: "Accept",
                      value: value,
                    }),
                  );
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            pagination
            responsive
            paginationServer
            columns={columns}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={commentsList.comments}
            subHeaderComponent={
              <CustomHeader
                store={commentsList.comments}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default CommentsList;
