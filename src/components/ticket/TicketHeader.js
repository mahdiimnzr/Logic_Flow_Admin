import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Label, Input } from "reactstrap";

const TicketHeader = ({
  rowsPerPage,
  handlePerPage,
  searchTerm,
  handleFilter,
}) => {
  const { t } = useTranslation();
  return (
    <Row className="mx-0 mt-1 mb-50 align-items-center">
      <Col
        sm="12"
        md="6"
        className="d-flex align-items-center flex-wrap gap-2 mb-1 mb-sm-0"
      >
        <div className="d-flex align-items-center">
          <Label for="sort-select" className="me-1 mb-0">
            {t("Show")}
          </Label>
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
          <Label for="sort-select" className="mb-0">
            {t("Records")}
          </Label>
        </div>
      </Col>
      <Col
        sm="12"
        md="6"
        className="d-flex align-items-center justify-content-sm-end"
      >
        <Label className="me-1 mb-0 text-nowrap" for="search-input">
          {t("Search")}
        </Label>
        <Input
          className="dataTable-filter"
          type="text"
          bsSize="sm"
          id="search-input"
          value={searchTerm}
          onChange={handleFilter}
          placeholder={t("TicketTitle")}
        />
      </Col>
    </Row>
  );
};

export default TicketHeader;
