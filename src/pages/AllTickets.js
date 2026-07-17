import React, { useState, Fragment, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Card, Spinner, TabContent, TabPane } from "reactstrap";
import { ChevronDown } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { toast } from "react-hot-toast";
import BreadCrumbs from "@components/breadcrumbs";
import { useSkin } from "@hooks/useSkin";

import {
    getAllTicketsAdmin,
    acceptTicketAdmin,
    getNotAcceptedTicketsSupporter,
    getMyTicketsSupporter
} from "../core/services/api/ticket/ticket.service";

import TicketTabs from "../components/ticket/TicketTabs";
import TicketHeader from "../components/ticket/TicketHeader";
import { getTicketColumns } from "../components/ticket/TicketColumns";

const AllTickets = () => {
    const { skin } = useSkin();

    const [activeTab, setActiveTab] = useState("1");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => setDebouncedSearchValue(searchTerm), 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchTicketsData = () => {
        if (activeTab === "1") return getAllTicketsAdmin(0, 1000, debouncedSearchValue);
        if (activeTab === "2") return getMyTicketsSupporter(0, 1000, debouncedSearchValue);
        if (activeTab === "3") return getNotAcceptedTicketsSupporter(0, 1000, debouncedSearchValue);
    };

    const { data: ticketsData, isLoading, isFetching, refetch } = useQuery({
        queryKey: ["ticketsList", activeTab, debouncedSearchValue],
        queryFn: fetchTicketsData,
        keepPreviousData: true,
    });

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setCurrentPage(1);
        }
    };

    const rawData = Array.isArray(ticketsData) ? ticketsData : [];
    const filteredData = rawData.filter(ticket =>
        ticket.problem?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
    );

    const totalCount = filteredData.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    const handleAcceptTicket = async (ticketId) => {
        const result = await acceptTicketAdmin(ticketId);
        const isSuccess = result && (result.success === true || result.id !== undefined || result.status === 200);

        if (isSuccess) {
            toast.success(result.message || "تیکت با موفقیت پذیرفته شد.");
            refetch();
        } else {
            toast.error("خطا در پذیرش تیکت.");
        }
    };

    const handleFilter = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const CustomPagination = () => {
        const count = Math.ceil(totalCount / rowsPerPage);
        return (
            <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                breakLabel="..."
                pageCount={Math.ceil(count) || 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                activeClassName="active"
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={(page) => setCurrentPage(page.selected + 1)}
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
        table: { style: { backgroundColor: 'transparent' } },
        headRow: { style: { backgroundColor: skin === 'dark' ? '#343d55' : '#f3f2f7', color: skin === 'dark' ? '#d0d2d6' : '#5e5873', borderBottomColor: skin === 'dark' ? '#3b4253' : '#ebe9f1' } },
        rows: { style: { backgroundColor: skin === 'dark' ? '#283046' : '#ffffff', color: skin === 'dark' ? '#d0d2d6' : '#6e6b7b', borderBottomColor: skin === 'dark' ? '#3b4253' : '#ebe9f1', '&:hover': { backgroundColor: skin === 'dark' ? '#343d55' : '#f8f8f8' } } },
        pagination: { style: { backgroundColor: skin === 'dark' ? '#283046' : '#ffffff', color: skin === 'dark' ? '#d0d2d6' : '#6e6b7b', borderTopColor: skin === 'dark' ? '#3b4253' : '#ebe9f1' } },
        noData: { style: { backgroundColor: skin === 'dark' ? '#283046' : '#ffffff', color: skin === 'dark' ? '#d0d2d6' : '#6e6b7b' } },
        tableWrapper: { style: { backgroundColor: skin === 'dark' ? '#283046' : '#ffffff' } }
    };

    return (
        <Fragment>
            <BreadCrumbs title="لیست تیکت ها" data={[{ title: "مدیریت تیکت ها" }, { title: "لیست تیکت ها" }]} />

            <TicketTabs activeTab={activeTab} toggleTab={toggleTab} />

            <TabContent activeTab={activeTab}>
                <TabPane tabId={activeTab}>
                    <Card>
                        <TicketHeader
                            rowsPerPage={rowsPerPage}
                            handlePerPage={handlePerPage}
                            searchTerm={searchTerm}
                            handleFilter={handleFilter}
                        />

                        <div className="react-dataTable position-relative">
                            {(isLoading || isFetching) && (
                                <div className="d-flex justify-content-center position-absolute w-100 h-100 align-items-center" style={{ zIndex: 1, backgroundColor: skin === 'dark' ? "rgba(40, 48, 70, 0.8)" : "rgba(255,255,255,0.6)", borderRadius: "0.5rem" }}>
                                    <Spinner color="primary" />
                                </div>
                            )}

                            <DataTable
                                noHeader
                                pagination
                                paginationServer
                                className="react-dataTable"
                                columns={getTicketColumns(handleAcceptTicket)}
                                sortIcon={<ChevronDown size={10} />}
                                paginationComponent={CustomPagination}
                                data={displayData}
                                customStyles={customStyles}
                                noDataComponent={<div className="p-4 text-center text-muted">رکوردی برای نمایش وجود ندارد</div>}
                            />
                        </div>
                    </Card>
                </TabPane>
            </TabContent>
        </Fragment>
    );
};

export default AllTickets;