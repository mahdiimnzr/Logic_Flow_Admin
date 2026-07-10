import { useForm, Controller } from "react-hook-form";
import Avatar from "@components/avatar";
import { Eye } from "react-feather";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = Yup.object({
  levelName: Yup.string().required("LevelNameRequired"),
});

const renderClient = (row) => {
  if (row?.iconAddress) {
    return (
      <ImageFallback
        className="me-1"
        style={{ borderRadius: "100%", width: "32px", height: "32px" }}
        src={row.iconAddress}
        fallback={profile}
      />
    );
  }
  return (
    <Avatar
      initials
      className="me-1"
      color="light-primary"
      content={row?.levelName?.toUpperCase() || "Unknown"}
    />
  );
};

export const columns = (t) => [
  {
    sortable: true,
    minWidth: "200px",
    sortField: "levelName",
    selector: (row) => row.levelName,
    cell: (row) => renderClient(row)

  },
  {
    name: t("LevelName"),
    minWidth: "80px",
    sortable: true,
    sortField: "levelName",
    selector: (row) => row.levelName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">
        {row.levelName ? row.levelName : "-"}
      </span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "50px",
    cell: (row) => {
      const { t } = useTranslation();
      const [show, setShow] = useState(false);

      return (
        <div className="column-action d-flex gap-1">
          <Eye
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setShow(true)}
          />

          <Modal
            unmountOnClose
            isOpen={show}
            toggle={() => setShow(!show)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setShow(!show)}>
              {t("LevelDetail")}
            </ModalHeader>
            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("LevelName")}</Label>
                <span className="text-muted mb-0">{row.levelName || "-"}</span>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={() => setShow(false)}>
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];