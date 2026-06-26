// ** React Imports
import { Fragment, useState, useEffect, useMemo } from "react";

// ** Table Columns
import { columns } from "./ReserveColumns";

// ** Debounce Search
import debounce from "debounce";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
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
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";

const UserCourses = ({ data }) => {
  // ** I18n
  const { t } = useTranslation();

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            responsive
            columns={columns}
            className="react-dataTable"
            // data={data?.courseReserve}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default UserCourses;
