// ** React Imports
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import { Button, Input, Row, Col, Card } from "reactstrap";

// ** Store & Actions
// import { getData } from '../store'
// import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch } from "react-redux";
import debounce from "debounce";
import { updateCourseListParams } from "../../../redux/actions";

const CustomHeader = ({
  handleFilter,
  value,
  handleStatusValue,
  statusValue,
  handlePerPage,
  rowsPerPage,
}) => {
  return (
    <div className="invoice-list-table-header w-100 py-2">
      <Row>
        <Col lg="6" className="d-flex align-items-center ">
          <div className="d-flex align-items-center me-2">
            <label htmlFor="rows-per-page">Show</label>
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
          <Button tag={Link} to="/apps/invoice/add" color="primary">
            Add Record
          </Button>
        </Col>
        <Col
          lg="6"
          className="actions-right d-flex gap-1 align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0"
        >
          <div className="d-flex align-items-center">
            <label htmlFor="search-invoice">جستجو</label>
            <Input
              id="search-invoice"
              className="ms-50 me-2 w-100"
              type="text"
              value={value}
              onChange={(event) => {
                handleFilter(event.target.value);
              }}
              placeholder="جستجو دوره ها..."
            />
          </div>
          <Input
            className="w-auto px-3"
            type="select"
            value={statusValue}
            onChange={handleStatusValue}
          >
            <option value={null}>انتخاب کنید</option>
            <option value="costUp"> گران ترین</option>
            <option value="costDown"> ارزان ترین</option>
          </Input>
        </Col>
      </Row>
    </div>
  );
};

const InvoiceList = ({ courseList }) => {
  // ** Redux
  const dispatch = useDispatch();

  // ** States
  const [value, setValue] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ** Page Count
  const count = Number(Math.ceil(courseList?.totalCount / rowsPerPage));

  // ** Handle Search
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

  // ** Function in get data on rows per page
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

  // ** Function in get data on page change
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

  const dataToRender = () => {
    const filters = {
      q: value,
      status: statusValue,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    // if (store.data.length > 0) {
    //   return store.data
    // } else if (store.data.length === 0 && isFiltered) {
    //   return []
    // } else {
    //   return store.allData.slice(0, rowsPerPage)
    // }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    // dispatch(
    //   getData({
    //     q: value,
    //     page: currentPage,
    //     sort: sortDirection,
    //     status: statusValue,
    //     perPage: rowsPerPage,
    //     sortColumn: column.sortField
    //   })
    // )
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
