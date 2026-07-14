// ** React Import
import { useEffect, useRef, memo, useState } from "react";

// ** Full Calendar & it's Plugins
import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import faLocale from "@fullcalendar/core/locales/fa";
import Select from "react-select";
import { selectThemeColors } from "@utils";

// ** Third Party Components
import toast from "react-hot-toast";
import { Menu } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScheduleStatus } from "../../../core/services/api/scheduleManagement/scheduleManagement.service";

const Calendar = (props) => {
  // ** Refs
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const calendarRef = useRef(null);

  // ** Props
  const {
    store,
    isRtl,
    calendarsColor,
    blankEvent,
    toggleAddModal,
    setAddScheduleProp,
  } = props;
  const [statusModal, setStatusModal] = useState(false);
  const [statusProp, setStatusProp] = useState({
    active: false,
    id: null,
  });

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: store?.events?.length ? store?.events : [],
    locale: faLocale,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "sidebarToggle, prev,next, title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 4,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName =
        calendarsColor[calendarEvent._def.extendedProps.calendar];

      return [
        // Background Color
        `bg-light-${colorName}`,
      ];
    },

    eventClick({ event: clickedEvent }) {
      setSelectedStatus({
        value:
          clickedEvent._def.extendedProps.active == true
            ? "active"
            : "inActive",
        label:
          clickedEvent._def.extendedProps.active == true
            ? "active"
            : "inActive",
      });
      setStatusModal(!statusModal);
      setStatusProp({
        active: clickedEvent._def.extendedProps.active,
        id: clickedEvent._def.publicId,
      });
    },

    dateClick(info) {
      setAddScheduleProp({
        startDate: info.date.toISOString(),
      });
      toggleAddModal();
    },

    ref: calendarRef,

    // Get direction from app state (store)
    direction: isRtl ? "rtl" : "ltr",
  };

  const [selectedStatus, setSelectedStatus] = useState({
    value: statusProp.active == true ? "active" : "inActive",
    label: statusProp.active == true ? "active" : "inActive",
  });
  const statusOptions = [
    {
      value: "active",
      label: "active",
    },
    {
      value: "inActive",
      label: "inActive",
    },
  ];

  const { mutate: updateStatusMutate } = useMutation({
    mutationFn: updateScheduleStatus,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response?.data?.success === true) {
        setStatusModal(!statusModal);
        toast.success(response?.data?.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`AdminSchedule`],
        });
      } else {
        toast.error(response?.data?.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response?.data?.message, { id: context.toastId });
    },
  });

  return (
    <Card className="shadow-none border-0 mb-0 rounded-0">
      <CardBody className="pb-0">
        <FullCalendar {...calendarOptions} />{" "}
      </CardBody>
      <Modal
        unmountOnClose={true}
        isOpen={statusModal}
        toggle={() => setStatusModal(!statusModal)}
        className="modal-dialog-centered"
        style={{ fontFamily: "IRANYekanXFaNum" }}
      >
        <ModalHeader toggle={() => setStatusModal(!statusModal)}>
          {t("CourseStatus")}
        </ModalHeader>
        <ModalBody>
          <p className="text-muted mb-1">{t("ApplyStatus")}</p>
          <Label for="role-select">{t("CourseStatusId")}</Label>
          <Select
            isClearable={false}
            value={selectedStatus}
            options={statusOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(data) => setSelectedStatus(data)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              const values = {
                active: selectedStatus.value == "active" ? true : false,
                id: statusProp.id,
              };
              updateStatusMutate(values);
            }}
          >
            {t("ApplyStatus")}
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default memo(Calendar);
