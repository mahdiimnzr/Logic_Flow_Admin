import { Fragment, useState, useEffect, useMemo } from "react";
import { columns } from "./Columns";
import debounce from "debounce";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { Row, Col, Card, Input } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";

const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
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

const PaymentList = ({ data }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const mergedData = useMemo(() => {
    if (!data?.courseStudent) return [];
    return data.courseStudent.map((student) => {
      const payment = data.payments?.find(
        (p) => p.studentId === student.studentId,
      );
      return {
        ...student,
        payment: payment ?? null,
      };
    });
  }, [data]);

  const displayData = useMemo(() => {
    if (!mergedData) return [];
    if (debounceSearch.trim() === "") return mergedData;
    return mergedData.filter((value) =>
      `${value.user?.fName} ${value.user?.lName}`
        .toLowerCase()
        .includes(debounceSearch.toLowerCase()),
    );
  }, [debounceSearch, mergedData]);

  const count = Number(Math.ceil(displayData?.length / rowsPerPage));

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return displayData?.slice(start, start + rowsPerPage);
  }, [displayData, currentPage, rowsPerPage]);

  const handlePagination = (page) => setCurrentPage(page.selected + 1);

  const handlePerPage = (e) => setRowsPerPage(parseInt(e.currentTarget.value));

  const handleFilter = (val) => {
    setSearchTerm(val);
    handleSearch(val);
  };

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setDebounceSearch(value.trim());
      }, 1000),
    [displayData],
  );

  useEffect(() => {
    if (currentPage > count) setCurrentPage(count || 1);
  }, [count]);

  const CustomPagination = () => (
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

  return (
    <Fragment>
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
            data={currentPageData}
            subHeaderComponent={
              <CustomHeader
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
              />
            }
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default PaymentList;
