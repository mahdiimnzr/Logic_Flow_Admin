import { Fragment, useState, useEffect, useMemo } from "react";
import SidebarNewUsers from "./sideBar";
import { columns } from "./Columns";
import debounce from "debounce";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { selectThemeColors } from "@utils";
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
  Spinner,
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";
import { updateParams } from "../../redux/actions";
import { useDispatch } from "react-redux";

const CustomHeader = ({
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  const { t } = useTranslation();

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row className="d-flex justify-content-between">
        <Col
          xl="4"
          className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <label className="mb-0" htmlFor="search-invoice">
              {t("Search")}
            </label>
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              placeholder={t("SearchUser")}
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
        <Col xl="2" className="d-flex align-items-center justify-content-xl-end justify-content-end p-0">
          <div className="d-flex align-items-center">
            <label htmlFor="rows-per-page">{t("Show")}</label>
            <Input
              dir="ltr"
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
      </Row>
    </div>
  );
};

const UsersList = ({ usersList, isFetching }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const count = Number(Math.ceil(usersList?.totalCount / rowsPerPage)) || 1;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const search = value.trim() === "" ? null : value.trim();
        dispatch(updateParams({ key: "Query", value: search }));
      }, 1000),
    [dispatch],
  );

  const rolesList = usersList?.roles?.map((value) => ({
    value: value.id,
    label: value.name,
  }));

  const roleOptions = [
    { value: null, label: t("RolesSelection") },
    ...(rolesList ?? []),
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

  const handlePagination = (page) => {
    dispatch(updateParams({ key: "PageNumber", value: page.selected + 1 }));
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(updateParams({ key: "RowsOfPage", value: value }));
    setRowsPerPage(value);
  };

  const handleFilter = (val) => {
    setSearchTerm(val);
    handleSearch(val);
  };

  useEffect(() => {
    if (currentPage > count) {
      dispatch(updateParams({ key: "PageNumber", value: count }));
      setCurrentPage(count);
    }
  }, [count, currentPage, dispatch]);

  const CustomPagination = () => (
    <div className="d-flex align-items-center justify-content-end gap-1">
      {isFetching && <Spinner />}
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage ? currentPage - 1 : 0}
        onPageChange={handlePagination}
        pageClassName="page-item"
        nextLinkClassName="page-link"
        nextClassName="page-item next"
        previousClassName="page-item prev"
        previousLinkClassName="page-link"
        pageLinkClassName="page-link"
        containerClassName="pagination react-paginate justify-content-end my-2 pe-1"
      />
    </div>
  );

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
                        : null;
                  dispatch(updateParams({ key: "IsActiveUser", value }));
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
                        : null;
                  dispatch(updateParams({ key: "IsDeletedUser", value }));
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
            columns={columns(t)}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={usersList?.listUser || []}
            subHeaderComponent={
              <CustomHeader
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