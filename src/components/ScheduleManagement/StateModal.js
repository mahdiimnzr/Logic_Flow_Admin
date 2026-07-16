import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScheduleStatus } from "../../core/services/api/scheduleManagement/scheduleManagement.service";
import toast from "react-hot-toast";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useTranslation } from "react-i18next";

const StateModal = ({
  statusModal,
  setStatusModal,
  setSelectedStatus,
  selectedStatus,
  statusProp,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
  );
};

export default StateModal;
