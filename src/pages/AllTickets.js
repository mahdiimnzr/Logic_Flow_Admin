import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Card, CardHeader, CardTitle, Input, Row, Col, Badge, Button, Spinner } from "reactstrap";
import { Eye, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getAllTicketsAdmin } from "@/core/services/api/ticket/ticket.service";

const AllTickets = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data: ticketsData, isLoading } = useQuery({
        queryKey: ["allTicketsAdmin", currentPage, rowsPerPage, searchTerm],
        queryFn: () => getAllTicketsAdmin(currentPage, rowsPerPage, searchTerm),
        keepPreviousData: true,
    });

    const columns = [
        {
            name: "موضوع تیکت",
            minWidth: "250px",
            selector: (row) => row.problem,
            cell: (row) => <span className="text-truncate font-weight-bold">{row.problem}</span>,
        },
        {
            name: "کد کاربر",
            minWidth: "100px",
            selector: (row) => row.userId,
            cell: (row) => <span>{row.userId}</span>,
        },
        {
            name: "وضعیت",
            minWidth: "120px",
            selector: (row) => row.isDone,
            cell: (row) => {
                return row.isDone ? (
                    <Badge color="light-secondary" pill>بسته شده</Badge>
                ) : row.supporterId ? (
                    <Badge color="light-warning" pill>در حال بررسی</Badge>
                ) : (
                    <Badge color="light-danger" pill>در انتظار پشتیبان</Badge>
                );
            },
        },
        {
            name: "تاریخ بروزرسانی",
            minWidth: "150px",
            selector: (row) => row.updateDate,
            cell: (row) => <span>{row.updateDate ? row.updateDate.substring(0, 10) : "---"}</span>,
        },
        {
            name: "عملیات",
            minWidth: "150px",
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <Button
                        color="flat-primary"
                        className="btn-icon rounded-circle"
                        onClick={() => navigate(`/AdminPanel/TicketDetail/${row.id}`)}
                    >
                        <Eye size={18} />
                    </Button>
                    {!row.supporterId && !row.isDone && (
                        <Button
                            color="flat-success"
                            className="btn-icon rounded-circle"
                            title="پذیرش تیکت"
                            onClick={() => console.log("Accept Ticket", row.id)}
                        >
                            <UserCheck size={18} />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const handleFilter = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    return (
        <Card>
            <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
                <CardTitle tag="h4">مدیریت کل تیکت‌ها</CardTitle>
            </CardHeader>

            <Row className="mx-0 mt-1 mb-50">
                <Col sm="6">
                    <div className="d-flex align-items-center">
                        <span className="me-1">جستجو:</span>
                        <Input
                            className="dataTable-filter w-100"
                            type="text"
                            placeholder="جستجو در موضوع تیکت..."
                            value={searchTerm}
                            onChange={handleFilter}
                        />
                    </div>
                </Col>
            </Row>

            <div className="react-dataTable">
                <DataTable
                    noHeader
                    pagination
                    paginationServer
                    highlightOnHover
                    responsive
                    progressPending={isLoading}
                    progressComponent={<Spinner color="primary" className="my-2" />}
                    columns={columns}
                    data={ticketsData || []}
                    className="react-dataTable"
                    sortIcon={<span className="ms-50">▼</span>}
                    paginationTotalRows={100} 
                    onChangePage={(page) => setCurrentPage(page - 1)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setRowsPerPage(newPerPage);
                        setCurrentPage(page - 1);
                    }}
                />
            </div>
        </Card>
    );
};

export default AllTickets;