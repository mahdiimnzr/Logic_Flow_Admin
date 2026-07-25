import { Fragment, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { Row, Col } from "reactstrap";
import Calendar from "./Calendar";
import SidebarLeft from "./SidebarLeft";
import { useRTL } from "@hooks/useRTL";
import { useSelector } from "react-redux";
import "@styles/react/apps/app-calendar.scss";
import AddScheduleModal from "../AddSchedulModal";
import { useQueryClient } from "@tanstack/react-query";
import { useGetStudentSchedule } from "../../../core/services/api/scheduleManagement/scheduleManagement.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const calendarsColor = {
  Business: "primary",
  Holiday: "success",
  Personal: "danger",
  Family: "warning",
  ETC: "info",
};

const CalendarComponent = () => {
  const navigate = useNavigate();
  const params = useSelector((state) => state.scheduleSlice.params.student);
  const store = useSelector((state) => state.calendar);
  const queryClient = useQueryClient();

  const { isLoading, data, isFetching } = useGetStudentSchedule(params, {
    enabled: !!params?.StudentId,
  });

  const courseGroups = queryClient.getQueryState([
    "AdminScheduleCourseGroups",
    { RowsOfPage: 500000 },
  ]);

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
      (Array.isArray(data?.data) ? data?.data : [])?.map((value) => {
        const thisGroup = (
          courseGroups?.data?.data?.courseGroupDtos ?? []
        ).find((group) => group.groupId == value.courseGroupId);

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
          title: thisGroup?.groupName,
          url: "",
          active: value.AP,
        };
      }),
    [data],
  );

  useEffect(() => {
    if (data?.data?.success == false) {
      navigate("/");
      toast.error(data?.data?.message);
    }
    () => null;
  }, [data?.data]);

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
