import { Fragment, useState, useEffect, useMemo } from "react";
import { columns } from "./Columns";
import debounce from "debounce";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { Row, Col, Card, Input, Label, Button, Spinner } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";
import SidebarNewMentor from "./SideBar";
import { useParams } from "react-router-dom";

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
              value={searchTerm}
              placeholder={t("SearchMentors")}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center table-header-actions">
            <Button
              className="add-new-user"
              color="primary"
              onClick={toggleSidebar}
            >
              {t("AddMentor")}
            </Button>
          </div>
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
          </div>
        </Col>
      </Row>
    </div>
  );
};

const MentorList = ({ data, isFetching }) => {
  const { t } = useTranslation();
  const { courseId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((value) => value.courseId === courseId);
  }, [data, courseId]);

  const displayData = useMemo(() => {
    if (!debounceSearch.trim()) return filteredData;
    return filteredData.filter((value) =>
      value.assistanceName?.toLowerCase().includes(debounceSearch.toLowerCase())
    );
  }, [debounceSearch, filteredData]);

  const count = Math.ceil(displayData.length / rowsPerPage) || 1;

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return displayData.slice(start, start + rowsPerPage);
  }, [displayData, currentPage, rowsPerPage]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.currentTarget.value));
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
                toggleSidebar={toggleSidebar}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
              />
            }
          />
        </div>
      </Card>

      <SidebarNewMentor open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default MentorList;