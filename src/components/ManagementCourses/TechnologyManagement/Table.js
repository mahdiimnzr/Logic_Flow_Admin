import { Fragment, useState, useEffect, useMemo } from "react";
import SidebarNewUsers from "./TechSideBar";
import { columns } from "./TechColumns";
import debounce from "debounce";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
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
          xl="3"
          className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <label className="mb-0" htmlFor="search-invoice">
              {t("Search")}
            </label>
            <Input
              id="search-invoice"
              placeholder={t("SearchTechnologies")}
              className="ms-50 w-100"
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>

        <Col xl="6" className="d-flex align-items-center justify-content-xl-end justify-content-start p-0">
          <div className="d-flex align-items-center">
            <label htmlFor="rows-per-page">{t("Show")}</label>
            <Input
              className="mx-50"
              dir="ltr"
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

const TechnologyList = ({ technology, isFetching }) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const displayData = useMemo(() => {
    if (!technology) return [];
    if (!debounceSearch.trim()) return technology;
    return technology.filter((value) =>
      value.techName?.toLowerCase().includes(debounceSearch.toLowerCase())
    );
  }, [technology, debounceSearch]);

  const count = Math.ceil(displayData.length / rowsPerPage) || 1;

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return displayData.slice(start, start + rowsPerPage);
  }, [displayData, currentPage, rowsPerPage]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
  };

  const handleFilter = (val) => {
    setSearchTerm(val);
    handleSearch(val);
  };

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setDebounceSearch(value.trim());
      }, 1000),
    []
  );

  useEffect(() => {
    if (currentPage > count) {
      setCurrentPage(count);
    }
  }, [count, currentPage]);

  const CustomPagination = () => (
    <div className="d-flex align-items-center justify-content-end gap-1">
      {isFetching && <Spinner />}
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        pageCount={count}
        activeClassName="active"
        forcePage={currentPage - 1}
        onPageChange={handlePagination}
        pageClassName="page-item"
        nextClassName="page-item next"
        previousClassName="page-item prev"
        pageLinkClassName="page-link"
        nextLinkClassName="page-link"
        previousLinkClassName="page-link"
        containerClassName="pagination react-paginate justify-content-end my-2 pe-1"
      />
    </div>
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
            columns={columns(t)}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={currentPageData}
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

export default TechnologyList;