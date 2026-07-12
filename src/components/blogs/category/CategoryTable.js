import { Fragment, useState, memo } from "react";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Spinner } from "reactstrap";
import { getCategoryColumns } from "./CategoryColumns";
import { useSkin } from '@hooks/useSkin';

const CategoryTable = ({ data = [], isLoading, onEditClick }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const { skin } = useSkin();

    const filteredData = data.filter(item => item.categoryName?.toLowerCase().includes(searchValue.toLowerCase()));

    const totalCount = filteredData.length;
    const count = Math.ceil(totalCount / rowsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleFilter = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    const handlePagination = (page) => {
        setCurrentPage(page.selected + 1);
    };

    const handlePerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const CustomPagination = () => {
        return (
            <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                breakLabel="..."
                pageCount={count || 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                activeClassName="active"
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={(page) => handlePagination(page)}
                pageClassName="page-item"
                breakClassName="page-item"
                nextLinkClassName="page-link"
                pageLinkClassName="page-link"
                breakLinkClassName="page-link"
                previousLinkClassName="page-link"
                nextClassName="page-item next-item"
                previousClassName="page-item prev-item"
                containerClassName={"pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"}
            />
        );
    };

    const customStyles = {
        table: {
            style: {
                backgroundColor: 'transparent',
            }
        },
        headRow: {
            style: {
                backgroundColor: skin === 'dark' ? '#343d55' : '#f3f2f7',
                color: skin === 'dark' ? '#d0d2d6' : '#5e5873',
                borderBottomColor: skin === 'dark' ? '#3b4253' : '#ebe9f1',
            }
        },
        rows: {
            style: {
                backgroundColor: skin === 'dark' ? '#283046' : '#ffffff',
                color: skin === 'dark' ? '#d0d2d6' : '#6e6b7b',
                borderBottomColor: skin === 'dark' ? '#3b4253' : '#ebe9f1',
                '&:hover': {
                    backgroundColor: skin === 'dark' ? '#343d55' : '#f8f8f8',
                }
            }
        },
        pagination: {
            style: {
                backgroundColor: skin === 'dark' ? '#283046' : '#ffffff',
                color: skin === 'dark' ? '#d0d2d6' : '#6e6b7b',
                borderTopColor: skin === 'dark' ? '#3b4253' : '#ebe9f1',
            }
        },
        noData: {
            style: {
                backgroundColor: skin === 'dark' ? '#283046' : '#ffffff',
                color: skin === 'dark' ? '#d0d2d6' : '#6e6b7b',
            }
        },
        tableWrapper: {
            style: {
                backgroundColor: skin === 'dark' ? '#283046' : '#ffffff',
            }
        }
    };

    return (
        <Fragment>
            <Card>
                <CardHeader className="border-bottom">
                    <CardTitle tag="h4">لیست دسته‌بندی‌ها</CardTitle>
                </CardHeader>
                <Row className="mx-0 mt-1 mb-50">
                    <Col sm="6">
                        <div className="d-flex align-items-center">
                            <Label for="sort-select">نمایش</Label>
                            <Input
                                className="dataTable-select mx-1"
                                type="select"
                                id="sort-select"
                                value={rowsPerPage}
                                onChange={(e) => handlePerPage(e)}
                                style={{ width: "5rem" }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </Input>
                            <Label for="sort-select">رکورد</Label>
                        </div>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="6">
                        <Label className="me-1 w-20" for="search-input">جستجو</Label>
                        <Input
                            className="dataTable-filter"
                            type="text"
                            bsSize="sm"
                            id="search-input"
                            value={searchValue}
                            onChange={handleFilter}
                            placeholder="نام دسته‌بندی ..."
                        />
                    </Col>
                </Row>
                <div className="react-dataTable position-relative">
                    {isLoading && (
                        <div
                            className="d-flex justify-content-center position-absolute w-100 h-100 align-items-center"
                            style={{
                                zIndex: 1, backgroundColor: skin === 'dark' ? "rgba(40, 48, 70, 0.8)" : "rgba(255,255,255,0.6)",
                                borderRadius: "0.5rem"
                            }}
                        >
                            <Spinner color="primary" />
                        </div>
                    )}

                    <DataTable
                        noHeader
                        pagination
                        className="react-dataTable"
                        columns={getCategoryColumns(onEditClick)}
                        sortIcon={<ChevronDown size={10} />}
                        paginationComponent={CustomPagination}
                        data={paginatedData}
                        customStyles={customStyles}
                    />
                </div>
            </Card>
        </Fragment>
    );
};

export default memo(CategoryTable);