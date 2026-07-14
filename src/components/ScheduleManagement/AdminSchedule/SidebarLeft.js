// ** React Imports
import { Fragment, useMemo, useState } from "react";

// ** Custom Components
import classnames from "classnames";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Button,
  Input,
  Label,
  Col,
  Row,
  Spinner,
} from "reactstrap";

// ** illustration import
import illustration from "@src/assets/images/pages/calendar-illustration.png";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { updateAdminParams } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { X } from "react-feather";

// ** Filters Checkbox Array
const filters = [
  { label: "Personal", color: "danger", className: "form-check-danger mb-1" },
  { label: "Business", color: "primary", className: "form-check-primary mb-1" },
  { label: "Family", color: "warning", className: "form-check-warning mb-1" },
  { label: "Holiday", color: "success", className: "form-check-success mb-1" },
  { label: "ETC", color: "info", className: "form-check-info" },
];

const SidebarLeft = ({ toggleAddModal, setAddScheduleProp, isFetching }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const courses = queryClient.getQueryState(["ScheduleCoursesFilterAdmin"]);

  const [currentCourse, setCurrentCourse] = useState({
    value: null,
    label: t("UsersSelection"),
  });

  const coursesOptions = useMemo(() => {
    const options = (courses?.data?.data?.courseDtos ?? []).map((user) => ({
      value: user.courseId,
      label: user.title,
    }));
    return [
      {
        value: null,
        label: "هیچکدام",
      },
      ...options,
    ];
  }, [courses]);

  return (
    <Fragment>
      <Card className="sidebar-wrapper shadow-none">
        <CardBody className="card-body d-flex justify-content-center my-sm-0 mb-3">
          <Row>
            <Col xs="12">
              <Button
                color="primary"
                block
                onClick={() => {
                  setAddScheduleProp({
                    startDate: null,
                  });
                  toggleAddModal();
                }}
              >
                <span className="align-middle">افزودن زمان بندی</span>
              </Button>
            </Col>
            <Col xs="12" className="mt-2">
              <Label
                className="form-label d-flex align-items-center justify-content-between"
                for="userId"
              >
                {t("SelectUser")}{" "}
                {isFetching && (
                  <Spinner
                    style={{
                      width: "17px",
                      height: "17px",
                    }}
                  />
                )}
              </Label>
              <Select
                name="userId"
                id="userId"
                options={coursesOptions}
                placeholder={t("UsersSelection")}
                classNamePrefix={"select"}
                className={`react-select`}
                value={currentCourse}
                onChange={(selected) => {
                  setCurrentCourse(selected);
                  dispatch(
                    updateAdminParams({
                      key: "courseId",
                      value: selected.value,
                    }),
                  );
                }}
                styles={{
                  option: (base) => ({
                    ...base,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }),
                }}
              />
            </Col>
            <Col xs="12" className="mt-2">
              <Label
                className="form-label d-flex align-items-center justify-content-between"
                for="userId"
              >
                {t("StartDate")}{" "}
                {startDate && (
                  <X
                    size={17}
                    className="cursor-pointer"
                    onClick={() => {
                      setStartDate(null);
                      dispatch(
                        updateAdminParams({ key: "startDate", value: null }),
                      );
                    }}
                  />
                )}
              </Label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={startDate}
                calendarPosition="bottom-center"
                editable={false}
                placeholder={t("DatePlaceholder")}
                onChange={(date) => {
                  if (date) {
                    dispatch(
                      updateAdminParams({
                        key: "startDate",
                        value: date.toDate().toISOString(),
                      }),
                    );
                    setStartDate(date.toDate().toISOString());
                  } else {
                    dispatch(
                      updateAdminParams({ key: "startDate", value: null }),
                    );
                    setStartDate(null);
                  }
                }}
                inputClass={`form-control`}
                containerStyle={{ width: "100%" }}
              />
            </Col>
            <Col xs="12" className="mt-2">
              <Label
                className="form-label d-flex align-items-center justify-content-between"
                for="userId"
              >
                {t("EndDate")}{" "}
                {endDate && (
                  <X
                    size={17}
                    className="cursor-pointer"
                    onClick={() => {
                      setEndDate(null);
                      dispatch(
                        updateAdminParams({ key: "endDate", value: null }),
                      );
                    }}
                  />
                )}
              </Label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={endDate}
                calendarPosition="bottom-center"
                editable={false}
                placeholder={t("DatePlaceholder")}
                onChange={(date) => {
                  if (date) {
                    dispatch(
                      updateAdminParams({
                        key: "endDate",
                        value: date.toDate().toISOString(),
                      }),
                    );
                    setEndDate(date.toDate().toISOString());
                  } else {
                    dispatch(
                      updateAdminParams({ key: "endDate", value: null }),
                    );
                    setEndDate(null);
                  }
                }}
                inputClass={`form-control`}
                containerStyle={{ width: "100%" }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className="mt-auto">
        <img className="img-fluid" src={illustration} alt="illustration" />
      </div>
    </Fragment>
  );
};

export default SidebarLeft;
