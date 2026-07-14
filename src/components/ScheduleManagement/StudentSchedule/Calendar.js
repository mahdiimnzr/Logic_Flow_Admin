import { useRef, memo, useState } from "react";
import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import faLocale from "@fullcalendar/core/locales/fa";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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

  const [statusProp, setStatusProp] = useState({
    active: false,
    id: null,
  });

  const [selectedStatus, setSelectedStatus] = useState({
    value: statusProp.active === true ? "active" : "inActive",
    label:
      statusProp.active === true ? t("AttendanceDone") : t("AttendanceNotDone"),
  });

  const statusOptions = [
    {
      value: "active",
      label: t("AttendanceDone"),
    },
    {
      value: "inActive",
      label: t("AttendanceNotDone"),
    },
  ];

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

    direction: isRtl ? "rtl" : "ltr",
  };

  const { mutate: updateStatusMutate } = useMutation({
    mutationFn: updateScheduleStatus,

    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },

    onSuccess: (response, _, context) => {
      if (response?.data?.success === true) {
        setStatusModal(!statusModal);

        toast.success(response?.data?.message, {
          id: context.toastId,
        });

        queryClient.invalidateQueries({
          queryKey: ["AdminSchedule"],
        });
      } else {
        toast.error(response?.data?.message, {
          id: context.toastId,
        });
      }
    },

    onError: (response, _, context) => {
      toast.error(response?.data?.message, {
        id: context.toastId,
      });
    },
  });

  return (
    <Card className="shadow-none border-0 mb-0 rounded-0">
      <CardBody className="pb-0">
        <FullCalendar {...calendarOptions} />
      </CardBody>

      <Modal
        unmountOnClose
        isOpen={statusModal}
        toggle={() => setStatusModal(!statusModal)}
        className="modal-dialog-centered"
        style={{ fontFamily: "IRANYekanXFaNum" }}
      >
        <ModalHeader toggle={() => setStatusModal(!statusModal)}>
          {t("AttendanceStatus")}
        </ModalHeader>

        <ModalBody>
          <p className="text-muted mb-1">{t("ApplyStatus")}</p>

          <Label for="role-select">{t("AttendanceStatus")}</Label>

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
              updateStatusMutate({
                active: selectedStatus.value === "active",
                id: statusProp.id,
              });
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
