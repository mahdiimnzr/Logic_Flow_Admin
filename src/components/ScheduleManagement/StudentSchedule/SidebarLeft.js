import { Fragment, useMemo, useState } from "react";
import { Card, CardBody, Button, Label, Col, Row, Spinner } from "reactstrap";
import illustration from "@src/assets/images/pages/calendar-illustration.png";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { updateStudentParams } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { X } from "react-feather";

const SidebarLeft = ({ toggleAddModal, setAddScheduleProp, isFetching }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const users = queryClient.getQueryState([
    "ScheduleStudentsList",
    { RowsOfPage: 500000 },
  ]);

  const students = useMemo(
    () =>
      (users?.data?.data?.listUser ?? [])?.filter((value) =>
        value.roles.includes("student"),
      ),
    [users],
  );

  const [currentStudent, setCurrentStudent] = useState({
    value: null,
    label: t("SelectUser"),
  });

  const studentsOption = useMemo(() => {
    const options = (students ?? []).map((student) => ({
      value: student.id,
      label: student.fName + " " + student.lName,
    }));

    return [
      {
        value: null,
        label: t("None"),
      },
      ...options,
    ];
  }, [students]);

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
                <span className="align-middle">{t("AddSchedule")}</span>
              </Button>
            </Col>

            <Col xs="12" className="mt-2">
              <Label
                className="form-label d-flex align-items-center justify-content-between"
                for="userId"
              >
                {t("SelectUser")}

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
                options={studentsOption}
                placeholder={t("SelectUser")}
                classNamePrefix="select"
                className="react-select"
                value={currentStudent}
                onChange={(selected) => {
                  setCurrentStudent(selected);

                  dispatch(
                    updateStudentParams({
                      key: "StudentId",
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
                for="startDate"
              >
                {t("StartDate")}

                {startDate && (
                  <X
                    size={17}
                    className="cursor-pointer"
                    onClick={() => {
                      setStartDate(null);

                      dispatch(
                        updateStudentParams({
                          key: "startDate",
                          value: null,
                        }),
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
                placeholder={t("StartDatePlaceholder")}
                onChange={(date) => {
                  if (date) {
                    dispatch(
                      updateStudentParams({
                        key: "startDate",
                        value: date.toDate().toISOString(),
                      }),
                    );

                    setStartDate(date.toDate().toISOString());
                  } else {
                    dispatch(
                      updateStudentParams({
                        key: "startDate",
                        value: null,
                      }),
                    );

                    setStartDate(null);
                  }
                }}
                inputClass="form-control"
                containerStyle={{ width: "100%" }}
              />
            </Col>

            <Col xs="12" className="mt-2">
              <Label
                className="form-label d-flex align-items-center justify-content-between"
                for="endDate"
              >
                {t("EndDate")}

                {endDate && (
                  <X
                    size={17}
                    className="cursor-pointer"
                    onClick={() => {
                      setEndDate(null);

                      dispatch(
                        updateStudentParams({
                          key: "endDate",
                          value: null,
                        }),
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
                placeholder={t("EndDatePlaceholder")}
                onChange={(date) => {
                  if (date) {
                    dispatch(
                      updateStudentParams({
                        key: "endDate",
                        value: date.toDate().toISOString(),
                      }),
                    );

                    setEndDate(date.toDate().toISOString());
                  } else {
                    dispatch(
                      updateStudentParams({
                        key: "endDate",
                        value: null,
                      }),
                    );

                    setEndDate(null);
                  }
                }}
                inputClass="form-control"
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
