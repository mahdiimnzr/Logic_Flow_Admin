import { Fragment, useState, memo } from "react";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";

import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Button,
} from "reactstrap";

import { SessionColumns } from "./SessionColumns";


const mockData = [
  { id: 1, title: "جلسه اول: مقدمات شبکه", courseName: "دوره نتورک پلاس", date: "1403/05/12", isActive: true },
  { id: 2, title: "جلسه دوم: ساب‌نتینگ", courseName: "دوره نتورک پلاس", date: "1403/05/19", isActive: true },
  { id: 3, title: "جلسه اول: آشنایی با React", courseName: "بوت‌کمپ فرانت‌اند", date: "1403/06/01", isActive: false },
];

const SessionListTable = () => {
  const navigate = useNavigate();
  const { skin } = useSkin();

  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFilter = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  
  const customStyles = {
    table: { style: { backgroundColor: "transparent" } },
    headRow: {
      style: {
        backgroundColor: skin === "dark" ? "#343d55" : "#f3f2f7",
        color: skin === "dark" ? "#d0d2d6" : "#5e5873",
        borderBottomColor: skin === "dark" ? "#3b4253" : "#ebe9f1",
      },
    },
    rows: {
      style: {
        backgroundColor: skin === "dark" ? "#283046" : "#ffffff",
        color: skin === "dark" ? "#d0d2d6" : "#6e6b7b",
        borderBottomColor: skin === "dark" ? "#3b4253" : "#ebe9f1",
        "&:hover": {
          backgroundColor: skin === "dark" ? "#343d55" : "#f8f8f8",
        },
      },
    },
    noData: {
      style: {
        backgroundColor: skin === "dark" ? "#283046" : "#ffffff",
        color: skin === "dark" ? "#d0d2d6" : "#6e6b7b",
      },
    },
    tableWrapper: {
      style: { backgroundColor: skin === "dark" ? "#283046" : "#ffffff" },
    },
  };

  return (
    <Fragment>
      <Card>

        <Row className="mx-0 mt-1 mb-50 align-items-center">
          <Col sm="12" md="7" className="d-flex align-items-center flex-wrap gap-2 mb-1 mb-sm-0">
            <div className="d-flex align-items-center">
              <Label for="sort-select" className="me-1 mb-0">نمایش</Label>
              <Input
                className="dataTable-select mx-1"
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
              <Label for="sort-select" className="mb-0">رکورد</Label>
            </div>

            <Button color="primary" onClick={() => navigate("/session/add")}>
              ساخت جلسه جدید
            </Button>
          </Col>
          <Col sm="12" md="5" className="d-flex align-items-center justify-content-sm-end">
            <Label className="me-1 mb-0 text-nowrap" for="search-input">جستجو</Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
              placeholder="عنوان جلسه..."
            />
          </Col>
        </Row>

        <div className="react-dataTable position-relative">
          <DataTable
            noHeader
            className="react-dataTable"
            columns={SessionColumns}
            sortIcon={<ChevronDown size={10} />}
            data={mockData}
            customStyles={customStyles}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default memo(SessionListTable);