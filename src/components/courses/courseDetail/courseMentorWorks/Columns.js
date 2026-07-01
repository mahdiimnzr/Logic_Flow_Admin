import { useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useTranslation } from "react-i18next";
import EditModal from "./EditModal";
import formatDate from "../../../../core/utils/formatDate";

export const buildColumns = (mentors) => [
  {
    name: "WorkTitle",
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "worktitle",
    selector: (row) => row.worktitle,
    cell: (row) => (
      <span
        className="fw-bolder text-truncate d-block w-100"
        style={{ minWidth: 0 }}
      >
        {row.worktitle}
      </span>
    ),
  },
  {
    name: "MentorName",
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "mentorName",
    selector: (row) => row.mentorName,
    cell: (row) => <span className="fw-bolder">{row.mentorName ?? "-"}</span>,
  },
  {
    name: "WorkDate",
    sortable: true,
    minWidth: "180px",
    sortField: "workDate",
    selector: (row) => row.workDate,
    cell: (row) => (
      <span>
        {row.workDate
          ? new Date(row.workDate).toLocaleDateString("fa-IR")
          : "-"}
      </span>
    ),
  },
  {
    name: "Actions",
    minWidth: "180px",
    cell: (row) => {
      const { t } = useTranslation();
      const [detailOpen, setDetailOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);

      const toggleDetail = () => setDetailOpen(!detailOpen);
      const toggleEdit = () => setEditOpen(!editOpen);
      return (
        <div className="d-flex align-items-center gap-1">
          <Button.Ripple onClick={toggleDetail} color="secondary" size="sm">
            {t("Detail")}
          </Button.Ripple>
          <Button.Ripple onClick={toggleEdit} color="primary" size="sm">
            {t("Edit")}
          </Button.Ripple>

          {detailOpen && (
            <Modal
              unmountOnClose={true}
              isOpen={detailOpen}
              toggle={toggleDetail}
              className="modal-dialog-centered"
              style={{ fontFamily: "IRANYekanXFaNum" }}
            >
              <ModalHeader toggle={toggleDetail}>{t("WorkDetail")}</ModalHeader>
              <ModalBody>
                <Row>
                  <Col sm="12" className="mb-1">
                    <h6 className="text-muted mb-1">{t("WorkTitle")}</h6>
                    <p className="fw-bolder">{row?.worktitle ?? "-"}</p>
                  </Col>
                  <Col sm="12" className="mb-1">
                    <h6 className="text-muted mb-1">{t("WorkDescribe")}</h6>
                    <p>{row?.workDescribe ?? "-"}</p>
                  </Col>
                  <Col sm="12">
                    <h6 className="text-muted mb-1">{t("WorkDate")}</h6>
                    <p>{row?.workDate ? formatDate(row.workDate) : "-"}</p>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          )}
          {editOpen && (
            <EditModal
              isOpen={editOpen}
              toggle={toggleEdit}
              work={row}
              mentors={mentors}
            />
          )}
        </div>
      );
    },
  },
];
