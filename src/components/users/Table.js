// ** React Imports
import { Fragment, useState, useEffect, useMemo } from "react";

// ** Invoice List Sidebar
import SidebarNewUsers from "./Sidebar";

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
import { updateParams } from "../../redux/actions";
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

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(store.data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }
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
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
            <label htmlFor="rows-per-page">{t("Entries")}</label>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
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

          <div className="d-flex align-items-center table-header-actions">
            <Button
              className="add-new-user"
              color="primary"
              onClick={toggleSidebar}
            >
              {t("CreateNewUser")}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const UsersList = ({ usersList }) => {
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
  const [currentRole, setCurrentRole] = useState({
    value: "",
    label: t("RolesSelection"),
  });
  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: t("StatusSelection"),
  });
  const [currentIsDelete, setCurrentIsDelete] = useState({
    value: "",
    label: t("DeleteSelection"),
  });

  // ** Page Count
  const count = Number(Math.ceil(usersList?.totalCount / rowsPerPage));

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ** Handle Search
  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const search = value.trim() === "" ? null : value.trim();
        dispatch(updateParams({ key: "Query", value: search }));
      }, 1000),
    [dispatch],
  );

  // ** User filter options
  const rolesList = usersList?.roles?.map((value) => {
    const roles = { value: value.id, label: value.name };
    return roles;
  });

  const roleOptions = [
    { value: null, label: t("RolesSelection"), number: 0 },
    ...(rolesList ?? {}),
  ];
  const statusOptions = [
    { value: null, label: t("StatusSelection") },
    { value: "active", label: t("Active") },
    { value: "deActive", label: t("DeActive") },
  ];
  const deleteOptions = [
    { value: null, label: t("DeleteSelection") },
    { value: "delete", label: t("Deleted") },
    { value: "notDeleted", label: t("NotDeleted") },
  ];

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(updateParams({ key: "PageNumber", value: page.selected + 1 }));
    setCurrentPage(page.selected + 1);
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(updateParams({ key: "RowsOfPage", value: e.currentTarget.value }));
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
      dispatch(updateParams({ key: "PageNumber", value: count || 1 }));
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
              <Label for="role-select">{t("Roles")}</Label>
              <Select
                isClearable={false}
                value={currentRole}
                options={roleOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentRole(data);
                  dispatch(updateParams({ key: "roleId", value: data.value }));
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
                    data.value === "active"
                      ? true
                      : data.value === "deActive"
                      ? false
                      : data.value;
                  dispatch(updateParams({ key: "IsActiveUser", value: value }));
                }}
              />
            </Col>
            <Col md="4">
              <Label for="delete-select">{t("isDelete")}</Label>
              <Select
                isClearable={false}
                value={currentIsDelete}
                options={deleteOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentIsDelete(data);
                  const value =
                    data.value === "delete"
                      ? true
                      : data.value === "notDeleted"
                      ? false
                      : data.value;
                  dispatch(
                    updateParams({ key: "IsDeletedUser", value: value }),
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
            data={usersList?.listUser}
            subHeaderComponent={
              <CustomHeader
                store={usersList}
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

      <SidebarNewUsers open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default UsersList;
