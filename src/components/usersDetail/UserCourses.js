import { Fragment } from "react";
import { columns } from "./Columns";
import DataTable from "react-data-table-component";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";
import { Card } from "reactstrap";

const UserCourses = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            responsive
            columns={columns(t)}
            className="react-dataTable"
            data={data ? data : []}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default UserCourses;
