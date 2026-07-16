import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { Trash } from "react-feather";
import {
  deleteFile,
  useGetSessionDetail,
} from "../../core/services/api/sessionManagement/session.service";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AddFile from "./AddFile/AddFile";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import HomeWorkModal from "./HomeWork/HomeWorkModal";
import StudentsListModal from "./StudentsListModal";

const SessionDetailModal = ({
  isOpen,
  setIsOpen,
  sessionDetailProp,
  toggleStatusModal,
  statusProp,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [fileModal, setFileModal] = useState(false);
  const [homeWorkModal, setHomeWorkModal] = useState(false);
  const [studentsModal, setStudentsModal] = useState(false);

  const { data, isFetching } = useGetSessionDetail(
    sessionDetailProp?.sessionId,
    {
      enabled: !!sessionDetailProp.sessionId,
    },
  );

  const { mutate: deleteFileMutate } = useMutation({
    mutationFn: deleteFile,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`SessionDetail-${statusProp?.id}`],
        });
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const toggleFileModal = () => setFileModal(!fileModal);
  const toggleHomeWorkModal = () => setHomeWorkModal(!homeWorkModal);
  const toggleStudentsModal = () => setStudentsModal(!studentsModal);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={() => setIsOpen(false)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setIsOpen(false)}>
          {t("SessionDetail")}{" "}
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
          <Row className="g-3">
            <Col md={7}>
              <Card>
                <CardBody>
                  <div className="info-row">
                    <span>{t("SessionTitle")}:</span>
                    <strong>{data?.data?.sessionTitle}</strong>
                  </div>

                  <div className="info-row mt-1">
                    <span>{t("AttendanceStatus")}:</span>
                    <strong>
                      {statusProp?.active
                        ? t("AttendanceDone")
                        : t("AttendanceNotDone")}
                    </strong>
                  </div>
                </CardBody>
              </Card>

              <Card style={{ maxHeight: "250px", overflowY: "auto" }}>
                <CardHeader>{t("SessionFiles")}</CardHeader>

                <CardBody className="d-flex flex-column gap-1">
                  {data?.data?.sessionFileDtos.length > 0
                    ? (data?.data?.sessionFileDtos ?? []).map(
                        (value, index) => (
                          <div
                            key={value.id}
                            className="d-flex align-items-center text-truncate"
                            style={{ gap: "4px" }}
                          >
                            <span>
                              {t("File")} {index + 1}:
                            </span>

                            <Link
                              target="blank"
                              to={value.fileAddress}
                              className="text-truncate"
                            >
                              {value.fileName}
                            </Link>

                            <Trash
                              onClick={() =>
                                deleteFileMutate({ sessionFileId: value.id })
                              }
                              size={17}
                              style={{ minWidth: "17px", minHeight: "17px" }}
                              className="cursor-pointer"
                            />
                          </div>
                        ),
                      )
                    : t("NoFilesFound")}
                </CardBody>
              </Card>
            </Col>

            <Col md={5}>
              <Card>
                <CardBody className="d-flex flex-column gap-2">
                  <Button color="primary" block onClick={toggleFileModal}>
                    {t("AddFile")}
                  </Button>

                  <Button color="warning" block onClick={toggleHomeWorkModal}>
                    {t("HomeWorks")}
                  </Button>

                  <Button color="info" block onClick={toggleStudentsModal}>
                    {t("ClassStudents")}
                  </Button>

                  <Button color="success" block onClick={toggleStatusModal}>
                    {t("AttendanceStatus")}
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <AddFile
        isOpen={fileModal}
        setIsOpen={setFileModal}
        statusProp={statusProp}
      />

      <HomeWorkModal
        sessionDetailProp={sessionDetailProp}
        isOpen={homeWorkModal}
        setIsOpen={setHomeWorkModal}
      />

      <StudentsListModal
        isOpen={studentsModal}
        setIsOpen={setStudentsModal}
        sessionDetailProp={sessionDetailProp}
      />
    </>
  );
};

export default SessionDetailModal;
