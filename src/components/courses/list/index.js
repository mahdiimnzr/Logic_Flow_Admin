import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { columns } from "./columns";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { Button, Input, Row, Col, Card, Label, Spinner } from "reactstrap";
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
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row className="d-flex align-items-center justify-content-between">
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <label className="mb-0" htmlFor="search-invoice">
              {t("Search")}
            </label>

            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              value={value}
              placeholder={t("SearchCourses")}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>

          <Button tag={Link} to="/Courses/Add" color="primary">
            {t("CreateNewCourse")}
          </Button>
        </Col>

        <Col
          sm="6"
          className="d-flex align-items-center justify-content-xl-end justify-content-start p-0"
        >
          <div className="d-flex align-items-center">
            <Label for="rows-per-page">{t("RowsPerPage")}</Label>

            <Input
              dir="ltr"
              className="form-control mx-1"
              type="select"
              id="sort-select"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Input>

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
          </div>
        </Col>
      </Row>
    </div>
  );
};

const InvoiceList = ({ courseList, isFetching }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [value, setValue] = useState("");
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
        updateCourseListParams({
          key: "SortingCol",
          value: "lastUpdate",
        }),
      );
      dispatch(updateCourseListParams({ key: "SortType", value: "desc" }));
    }

    setStatusValue(e.target.value);
  };

  const handlePagination = (page) => {
    dispatch(
      updateCourseListParams({
        key: "PageNumber",
        value: page.selected + 1,
      }),
    );

    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    return (
      <div className="d-flex align-items-center justify-content-end gap-1">
        {isFetching && <Spinner />}

        <ReactPaginate
          nextLabel=""
          breakLabel="..."
          previousLabel=""
          pageCount={count || 1}
          activeClassName="active"
          breakClassName="page-item"
          pageClassName="page-item"
          breakLinkClassName="page-link"
          onPageChange={handlePagination}
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          nextClassName="page-item next"
          previousClassName="page-item prev"
          pageLinkClassName="page-link"
          nextLinkClassName="page-link"
          previousLinkClassName="page-link"
          containerClassName="pagination react-paginate justify-content-end my-2 pe-1"
        />
      </div>
    );
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
            subHeader
            columns={columns(t)}
            responsive
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