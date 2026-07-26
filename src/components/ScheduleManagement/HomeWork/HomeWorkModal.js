import React, { useState } from "react";
import { useGetSessionHomeWorks } from "../../../core/services/api/sessionManagement/session.service";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import formatDate from "../../../core/utils/formatDate";
import { Eye } from "react-feather";
import AddHomeWorkModal from "./AddHomeWorkModal";

export const columns = (t) => [
  {
    name: t("HomeworkTitle"),
    minWidth: "100px",
    maxWidth: "200px",
    selector: (row) => row.hwTitle,
    cell: (row) => (
      <span className="fw-bolder text-truncate">{row.hwTitle}</span>
    ),
  },
  {
    name: t("HomeworkDescription"),
    minWidth: "200px",
    maxWidth: "420px",
    selector: (row) => row.hwDescribe,
    cell: (row) => <span className="text-truncate">{row.hwDescribe}</span>,
  },
  {
    name: t("CreatedDate"),
    minWidth: "50px",
    maxWidth: "200px",
    selector: (row) => row.homeWorkDate,
    cell: (row) => (
      <span className="text-truncate">{formatDate(row.homeWorkDate)}</span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "50px",
    maxWidth: "100px",
    cell: (row) => {
      const [detailModal, setDetailModal] = useState(false);

      return (
        <>
          <Eye
            size={17}
            className="cursor-pointer"
            onClick={() => setDetailModal(!detailModal)}
          />

          <Modal
            unmountOnClose
            isOpen={detailModal}
            toggle={() => setDetailModal(!detailModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setDetailModal(!detailModal)}>
              {t("HomeworkDetails")}
            </ModalHeader>

            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <label>{t("HomeworkTitle")}</label>
                <span className="text-muted mb-0">{row.hwTitle}</span>
              </div>

              <div className="mb-1 d-flex flex-column">
                <label>{t("HomeworkDescription")}</label>
                <span className="text-muted mb-0">{row.hwDescribe}</span>
              </div>

              <div className="mb-1 d-flex flex-column">
                <label>{t("CreatedDate")}</label>
                <span className="text-muted mb-0">
                  {formatDate(row.homeWorkDate)}
                </span>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="secondary"
                outline
                onClick={() => setDetailModal(false)}
              >
                {t("Close")}
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    },
  },
];

const HomeWorkModal = ({ isOpen, setIsOpen, sessionDetailProp }) => {
  const { t } = useTranslation();

  const [addHomeWorkModal, setAddHomeWorkModal] = useState(false);

  const { data, isFetching } = useGetSessionHomeWorks(
    sessionDetailProp?.sessionId,
    {
      enabled: !!sessionDetailProp.sessionId,
    },
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setIsOpen(!isOpen)}>
          {t("SessionHomeworks")}{" "}
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
          <Button
            color="primary"
            onClick={() => setAddHomeWorkModal(!addHomeWorkModal)}
          >
            {t("AddHomework")}
          </Button>

          <Button color="secondary" outline onClick={() => setIsOpen(!isOpen)}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </Modal>

      <AddHomeWorkModal
        isOpen={addHomeWorkModal}
        setIsOpen={setAddHomeWorkModal}
        sessionDetailProp={sessionDetailProp}
      />
    </>
  );
};

export default HomeWorkModal;
