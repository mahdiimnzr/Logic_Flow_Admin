import { useState } from "react";
import { Edit, Eye } from "react-feather";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import formatDate from "../../../../core/utils/formatDate";
import EditModal from "./EditModal";

export const columns = (mentors, t) => [
  {
    name: t("WorkTitle"),
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "worktitle",
    selector: (row) => row.worktitle,
    cell: (row) => (
      <span className="fw-bolder text-truncate">{row.worktitle}</span>
    ),
  },
  {
    name: t("MentorName"),
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "mentorName",
    selector: (row) => row.mentorName,
    cell: (row) => <span className="fw-bolder">{row.mentorName ?? "-"}</span>,
  },
  {
    name: t("WorkDate"),
    sortable: true,
    minWidth: "180px",
    sortField: "workDate",
    selector: (row) => row.workDate,
    cell: (row) => (
      <span>
        {row.workDate ? formatDate(row.workDate) : "-"}
      </span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "180px",
    cell: (row) => {
      const [detailOpen, setDetailOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);

      const toggleDetail = () => setDetailOpen(!detailOpen);
      const toggleEdit = () => setEditOpen(!editOpen);

      return (
        <div className="d-flex align-items-center gap-1">
          <Eye
            size={17}
            className="me-50 cursor-pointer"
            onClick={toggleDetail}
          />
          <Edit
            size={17}
            className="me-50 cursor-pointer"
            onClick={toggleEdit}
          />

          <Modal
            unmountOnClose
            isOpen={detailOpen}
            toggle={toggleDetail}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={toggleDetail}>
              {t("WorkDetail")}
            </ModalHeader>
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

          <EditModal
            isOpen={editOpen}
            toggle={toggleEdit}
            work={row}
            mentors={mentors}
          />
        </div>
      );
    },
  },
];