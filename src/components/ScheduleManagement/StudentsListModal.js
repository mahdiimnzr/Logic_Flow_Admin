import DataTable from "react-data-table-component";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { useGetSessionStudents } from "../../core/services/api/scheduleManagement/scheduleManagement.service";
import { useTranslation } from "react-i18next";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export const columns = (t) => [
  {
    name: t("StudentUsername"),
    minWidth: "200px",
    maxWidth: "400px",
    selector: (row) => row.gmail,
    cell: (row) => <span className="fw-bolder text-truncate">{row.gmail}</span>,
  },
  {
    name: t("StudentNumber"),
    minWidth: "100px",
    maxWidth: "200px",
    selector: (row) => row.phoneNumber,
    cell: (row) => (
      <span className="fw-bolder text-truncate">{row.phoneNumber}</span>
    ),
  },
];

const StudentsListModal = ({ isOpen, setIsOpen, sessionDetailProp }) => {
  const { t } = useTranslation();

  const { data, isFetching } = useGetSessionStudents(
    sessionDetailProp?.sessionId,
    {
      enabled: !!sessionDetailProp.sessionId,
    },
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)}>
        {t("ClassStudents")}{" "}
        {isFetching && (
          <Spinner
            style={{
              width: "17px",
              height: "17px",
            }}
          />
        )}
      </ModalHeader>

      <ModalBody>
        <Card className="overflow-hidden">
          <div className="react-dataTable">
            <DataTable
              noHeader
              responsive
              columns={columns(t)}
              className="react-dataTable"
              data={data?.data || []}
            />
          </div>
        </Card>
      </ModalBody>

      <ModalFooter className="d-flex align-items-center justify-content-between">
        <Button color="secondary" outline onClick={() => setIsOpen(!isOpen)}>
          {t("Close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StudentsListModal;
