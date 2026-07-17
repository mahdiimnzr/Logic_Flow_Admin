import { useForm, Controller } from "react-hook-form";
import Avatar from "@components/avatar";
import { Edit } from "react-feather";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  Input,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { updateStatus } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const validationSchema = Yup.object({
  statusName: Yup.string().required("StatusNameRequired"),
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
      content={row?.statusName?.toUpperCase() || "Unknown"}
    />
  );
};

export const columns = (t) => [
  {
    sortable: true,
    minWidth: "200px",
    sortField: "statusName",
    selector: (row) => row.statusName,
    cell: (row) => renderClient(row),
  },
  {
    name: t("StatusName"),
    minWidth: "80px",
    sortable: true,
    sortField: "statusName",
    selector: (row) => row.statusName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.statusName}</span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "50px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();

      const [editModal, setEditModal] = useState(false);

      const defaultValues = {
        statusName: row.statusName ?? "",
        id: row.id ?? "",
      };

      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: updateStatusMutate } = useMutation({
        mutationFn: updateStatus,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          toast.success(response.data.message || t("StatusUpdated"), {
            id: context.toastId,
          });
          queryClient.invalidateQueries({ queryKey: ["Status"] });
          setEditModal(false);
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateStatusMutate(data);
      };

      return (
        <div className="column-action d-flex gap-1">
          <Edit
            id={`EyeStatus-${row.id}`}
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setEditModal(true)}
          />
          <UncontrolledTooltip placement="top" target={`EyeStatus-${row.id}`}>
            ویرایش وضعیت دوره
          </UncontrolledTooltip>

          <Modal
            isOpen={editModal}
            toggle={() => setEditModal(!editModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setEditModal(!editModal)}>
              {t("EditStatus")}
            </ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-5">
              <Row
                tag="form"
                className="gy-1 pt-75"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Col xs={12}>
                  <Label className="form-label" for="statusName">
                    {t("StatusName")}
                  </Label>
                  <Controller
                    name="statusName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="statusName"
                        placeholder={t("StatusName")}
                        invalid={!!errors.statusName}
                      />
                    )}
                  />
                  {errors.statusName && (
                    <FormFeedback>{t(errors.statusName.message)}</FormFeedback>
                  )}
                </Col>
                <Col
                  xs={12}
                  className="text-center d-flex justify-content-between mt-2 pt-50"
                >
                  <Button type="submit" className="me-1" color="primary">
                    {t("SaveChanges")}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    onClick={() => setEditModal(false)}
                  >
                    {t("Cancel")}
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>
      );
    },
  },
];
