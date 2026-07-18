import { Fragment, useMemo, useState } from "react";
import classnames from "classnames";
import { Row, Col } from "reactstrap";
import Calendar from "./Calendar";
import SidebarLeft from "./SidebarLeft";
import { useRTL } from "@hooks/useRTL";
import { useSelector } from "react-redux";
import "@styles/react/apps/app-calendar.scss";
import AddScheduleModal from "../AddSchedulModal";

const calendarsColor = {
  Business: "primary",
  Holiday: "success",
  Personal: "danger",
  Family: "warning",
  ETC: "info",
};

const CalendarComponent = ({ data, isFetching, isLoading }) => {
  const store = useSelector((state) => state.calendar);

  const [calendarApi, setCalendarApi] = useState(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [addScheduleProp, setAddScheduleProp] = useState({
    startDate: null,
  });

  const [isRtl] = useRTL();

  const toggleSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);

  const blankEvent = {
    allDay: false,
    end: "2026-07-14T15:26:28.157Z",
    extendedProps: { calendar: "Family" },
    id: 1,
    start: "2026-07-13T15:26:28.157Z",
    title: "Design Review",
    url: "",
  };

  const myEvents = useMemo(
    () =>
      data?.map((value) => {
        const endDate = new Date(value.startDate);
        const startDate = new Date(value.startDate);

        const splitEndTime = value.endTime.split(":");
        const splitStartTime = value.startTime.split(":");

        endDate.setUTCHours(
          Number(splitEndTime[0]),
          Number(splitEndTime[1]),
          0,
          0,
        );

        startDate.setUTCHours(
          Number(splitStartTime[0]),
          Number(splitStartTime[1]),
          0,
          0,
        );

        return {
          allDay: false,
          end: endDate.toISOString(),
          extendedProps: { calendar: "Business" },
          id: value.id,
          start: startDate.toISOString(),
          title: value.coursegroup.groupName,
          url: "",
          active: value.AP,
        };
      }),
    [data],
  );

  return (
    <Fragment>
      <div className="app-calendar overflow-hidden border">
        <Row className="g-0">
          <Col
            id="app-calendar-sidebar"
            className={classnames(
              "col app-calendar-sidebar flex-grow-0 d-flex flex-column",
              {
                show: leftSidebarOpen,
              },
            )}
          >
            <SidebarLeft
              toggleAddModal={toggleSidebar}
              isFetching={isFetching}
              isLoading={isLoading}
              setAddScheduleProp={setAddScheduleProp}
            />
          </Col>

          <Col className="position-relative">
            <Calendar
              isRtl={isRtl}
              store={{
                events: myEvents,
              }}
              blankEvent={blankEvent}
              calendarsColor={calendarsColor}
              toggleAddModal={toggleSidebar}
              setAddScheduleProp={setAddScheduleProp}
            />
          </Col>
        </Row>

        <AddScheduleModal
          addScheduleProp={addScheduleProp}
          addModal={leftSidebarOpen}
          toggleAddModal={toggleSidebar}
        />
      </div>
    </Fragment>
  );
};

export default CalendarComponent;
