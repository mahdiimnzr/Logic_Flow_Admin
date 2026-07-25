import { useRef, memo, useState } from "react";
import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import faLocale from "@fullcalendar/core/locales/fa";
import { Card, CardBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import StateModal from "../StateModal";
import SessionDetailModal from "../SessionDetailModal";

const Calendar = (props) => {
  const { t } = useTranslation();
  const calendarRef = useRef(null);

  const {
    store,
    isRtl,
    calendarsColor,
    blankEvent,
    toggleAddModal,
    setAddScheduleProp,
  } = props;

  const [statusModal, setStatusModal] = useState(false);
  const [sessionDetailModal, setSessionDetailModal] = useState(false);

  const [statusProp, setStatusProp] = useState({
    active: false,
    id: null,
  });
  const [sessionDetailProp, setSessionDetailProp] = useState({
    sessionId: "",
  });

  const [selectedStatus, setSelectedStatus] = useState({
    value: statusProp.active === true ? "active" : "inActive",
    label:
      statusProp.active === true ? t("AttendanceDone") : t("AttendanceNotDone"),
  });

  const calendarOptions = {
    events: store?.events?.length ? store.events : [],
    locale: faLocale,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "sidebarToggle, prev,next, title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    dayMaxEvents: 4,
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      const colorName =
        calendarsColor[calendarEvent._def.extendedProps.calendar];

      return [`bg-light-${colorName}`];
    },

    eventClick({ event: clickedEvent }) {
      setSelectedStatus({
        value:
          clickedEvent._def.extendedProps.active === true
            ? "active"
            : "inActive",
        label:
          clickedEvent._def.extendedProps.active === true
            ? t("AttendanceDone")
            : t("AttendanceNotDone"),
      });

      setStatusProp({
        active: clickedEvent._def.extendedProps.active,
        id: clickedEvent._def.publicId,
      });
      setSessionDetailProp({
        sessionId: clickedEvent._def.publicId,
      });
      setSessionDetailModal(!sessionDetailModal);
    },

    dateClick(info) {
      setAddScheduleProp({
        startDate: info.date.toISOString(),
      });

      toggleAddModal();
    },

    ref: calendarRef,

    direction: isRtl ? "rtl" : "ltr",
  };

  return (
    <Card className="shadow-none border-0 mb-0 rounded-0">
      <CardBody className="pb-0">
        <FullCalendar {...calendarOptions} />
      </CardBody>

      <StateModal
        statusModal={statusModal}
        setStatusModal={setStatusModal}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statusProp={statusProp}
      />
      <SessionDetailModal
        isOpen={sessionDetailModal}
        setIsOpen={setSessionDetailModal}
        sessionDetailProp={sessionDetailProp}
        toggleStatusModal={() => setStatusModal(!statusModal)}
        statusProp={statusProp}
      />
    </Card>
  );
};

export default memo(Calendar);
