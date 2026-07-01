import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { columns } from "./columns";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { Button, Input, Row, Col, Card } from "reactstrap";
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch } from "react-redux";
import debounce from "debounce";
import { updateCourseListParams } from "../../../redux/actions";
import { useTranslation } from "react-i18next";

const CustomHeader = ({
  handleFilter,
  value,
  handleStatusValue,
  statusValue,
  handlePerPage,
  rowsPerPage,
}) => {
  const { t } = useTranslation();
  return (
    <div className="invoice-list-table-header w-100 py-2">
      <Row>
        <Col lg="6" className="d-flex align-items-center ">
          <div className="d-flex align-items-center me-2">
            <label htmlFor="rows-per-page">{t("RowsPerPage")}</label>
            <Input
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              className="form-control ms-50 pe-3"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
          </div>
          <Button tag={Link} to="/Courses/Add" color="primary">
            {t("CreateNewCourse")}
          </Button>
        </Col>
        <Col
          lg="6"
          className="actions-right d-flex gap-1 align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0"
        >
          <div className="d-flex align-items-center">
            <label htmlFor="search-invoice">{t("Search")}</label>
            <Input
              id="search-invoice"
              className="ms-50 me-2 w-100"
              type="text"
              value={value}
              onChange={(event) => handleFilter(event.target.value)}
              placeholder={t("SearchCourses")}
            />
          </div>
          <Input
            className="w-auto px-3"
            type="select"
            value={statusValue}
            onChange={handleStatusValue}
          >
            <option value={null}>{t("SelectOption")}</option>
            <option value="costUp">{t("MostExpensive")}</option>
            <option value="costDown">{t("Cheapest")}</option>
          </Input>
        </Col>
      </Row>
    </div>
  );
};

const InvoiceList = ({ courseList }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const count = Number(Math.ceil(courseList?.totalCount / rowsPerPage));

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const search = value.trim() === "" ? null : value.trim();
        dispatch(updateCourseListParams({ key: "Query", value: search }));
      }, 1000),
    [dispatch],
  );

  const handleFilter = (val) => {
    setValue(val);
    handleSearch(val);
  };

  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      updateCourseListParams({
        key: "RowsOfPage",
        value: e.currentTarget.value,
      }),
    );
    setRowsPerPage(value);
  };

  const handleStatusValue = (e) => {
    if (e.target.value === "costUp") {
      dispatch(updateCourseListParams({ key: "SortingCol", value: "cost" }));
      dispatch(updateCourseListParams({ key: "SortType", value: "desc" }));
    } else if (e.target.value === "costDown") {
      dispatch(updateCourseListParams({ key: "SortingCol", value: "cost" }));
      dispatch(updateCourseListParams({ key: "SortType", value: "asc" }));
    } else {
      dispatch(
        updateCourseListParams({ key: "SortingCol", value: "lastUpdate" }),
      );
      dispatch(updateCourseListParams({ key: "SortType", value: "desc" }));
    }
    setStatusValue(e.target.value);
  };

  const handlePagination = (page) => {
    dispatch(
      updateCourseListParams({ key: "PageNumber", value: page.selected + 1 }),
    );
    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    return (
      <ReactPaginate
        nextLabel=""
        breakLabel="..."
        previousLabel=""
        pageCount={count || 1}
        activeClassName="active"
        breakClassName="page-item"
        pageClassName={"page-item"}
        breakLinkClassName="page-link"
        nextLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousLinkClassName={"page-link"}
        previousClassName={"page-item prev"}
        onPageChange={(page) => handlePagination(page)}
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        containerClassName={"pagination react-paginate justify-content-end p-1"}
      />
    );
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  return (
    <div className="invoice-list-wrapper">
      <Card>
        <div className="invoice-list-dataTable react-dataTable">
          <DataTable
            noHeader
            pagination
            sortServer
            paginationServer
            subHeader={true}
            columns={columns}
            responsive={true}
            onSort={handleSort}
            data={courseList?.courseDtos}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            defaultSortField="invoiceId"
            paginationDefaultPage={currentPage}
            paginationComponent={CustomPagination}
            subHeaderComponent={
              <CustomHeader
                value={value}
                statusValue={statusValue}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                handleStatusValue={handleStatusValue}
              />
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default InvoiceList;
