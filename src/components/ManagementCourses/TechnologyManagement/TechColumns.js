import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@components/avatar";
import { selectThemeColors } from "@utils";
import { Edit, Eye } from "react-feather";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ImageDropZone from "../../common/ImageDropZone";
import { updateTechnology } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const validationSchema = Yup.object({
  techName: Yup.string().required("TechNameRequired"),
  describe: Yup.string().required("TechDescribeRequired"),
  iconAddress: Yup.string().required("IconRequired"),
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
      content={row?.techName?.toUpperCase() || "Unknown"}
    />
  );
};

export const columns = (t) => [
  {
    name: t("Technology"),
    sortable: true,
    minWidth: "50px",
    maxWidth: "200px",
    sortField: "techName",
    selector: (row) => row.techName,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <span className="text-truncate text-muted mb-0">{row.techName}</span>
        </div>
      </div>
    ),
  },
  {
    name: t("TechDescribe"),
    minWidth: "80px",
    maxWidth: "800px",
    sortable: true,
    sortField: "describe",
    selector: (row) => row.describe,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.describe}</span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "50px",
    maxWidth: "100px",
    cell: (row) => {
      const { t } = useTranslation();
      const queryClient = useQueryClient();

      const [detailModal, setDetailModal] = useState(false);
      const [editModal, setEditModal] = useState(false);

      const defaultValues = {
        techName: row.techName ?? "",
        describe: row.describe ?? "",
        iconAddress: row.iconAddress ?? "",
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

      const { mutate: updateTechnologyMutate } = useMutation({
        mutationFn: updateTechnology,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          toast.success(response.data.message || t("TechnologyUpdated"), { id: context.toastId });
          queryClient.invalidateQueries({ queryKey: ["Technology"] });
          setEditModal(false);
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateTechnologyMutate(data);
      };

      return (
        <div className="column-action d-flex gap-1 align-items-center">
          <Eye
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setDetailModal(true)}
          />

          <Modal
            unmountOnClose
            isOpen={detailModal}
            toggle={() => setDetailModal(!detailModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setDetailModal(!detailModal)}>
              {t("TechnologyDetail")}
            </ModalHeader>
            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("TechName")}</Label>
                <span className="text-muted mb-0">{row.techName}</span>
              </div>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("TechDescribe")}</Label>
                <span className="text-muted mb-0">{row.describe}</span>
              </div>
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
              <Button
                color="primary"
                onClick={() => {
                  setDetailModal(false);
                  setEditModal(true);
                }}
              >
                {t("Edit")}
              </Button>
              <Button color="secondary" outline onClick={() => setDetailModal(false)}>
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={editModal}
            toggle={() => setEditModal(!editModal)}
            className="modal-dialog-centered modal-lg"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setEditModal(!editModal)}>
              {t("EditTechnology")}
            </ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-5">
              <Row tag="form" className="gy-1 pt-75" onSubmit={handleSubmit(onSubmit)}>
                <Col xs={12}>
                  <Label className="form-label" for="techName">
                    {t("TechName")}
                  </Label>
                  <Controller
                    name="techName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="techName"
                        placeholder={t("TechName")}
                        invalid={!!errors.techName}
                      />
                    )}
                  />
                  {errors.techName && <FormFeedback>{t(errors.techName.message)}</FormFeedback>}
                </Col>

                <Col xs={12}>
                  <Label className="form-label" for="describe">
                    {t("TechDescribe")}
                  </Label>
                  <Controller
                    name="describe"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="describe"
                        placeholder={t("TechDescribe")}
                        invalid={!!errors.describe}
                      />
                    )}
                  />
                  {errors.describe && <FormFeedback>{t(errors.describe.message)}</FormFeedback>}
                </Col>

                <Col xs={12}>
                  <ImageDropZone
                    currentImage={row?.iconAddress}
                    error={errors.iconAddress ? t(errors.iconAddress.message) : null}
                    onChange={(files) => {
                      if (files.length > 0) {
                        setValue("iconAddress", URL.createObjectURL(files[0]), { shouldValidate: true });
                      } else {
                        setValue("iconAddress", "", { shouldValidate: true });
                      }
                    }}
                  />
                </Col>

                <Col xs={12} className="text-center mt-2 pt-50 d-flex justify-content-between">
                  <Button type="submit" className="me-1" color="primary">
                    {t("SaveChanges")}
                  </Button>
                  <Button color="secondary" outline onClick={() => setEditModal(false)}>
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