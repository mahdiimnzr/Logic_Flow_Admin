import { Fragment } from "react";
import { columns } from "./ReserveColumns";
import DataTable from "react-data-table-component";
import { Card } from "reactstrap";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";

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
