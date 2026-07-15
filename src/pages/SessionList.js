import { Fragment } from "react";
import SessionListTable from "../components/session/list/SessionListTable";
import Breadcrumbs from "@components/breadcrumbs"; 

const SessionList = () => {
    return (
        <Fragment>
            <Breadcrumbs
                title="لیست جلسه‌ها دوره‌ها "
                data={[
                    { title: " جلسه‌ها", link: "/session/list" },
                    { title: "لیست جلسه‌ها دوره‌ها " },
                ]}
            />
            <div className="app-user-list">
                <SessionListTable />
            </div>
        </Fragment>
    );
};

export default SessionList;