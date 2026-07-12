import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
} from "reactstrap";
import { Edit } from "react-feather";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateCourseAssistance } from "../../../../core/services/api/CourseList/courseList.service";

const validationSchema = Yup.object({
  userId: Yup.number().typeError("UserIdRequired").required("UserIdRequired"),
});

export const columns = (t) => [
  {
    name: t("MentorName"),
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "assistanceName",
    selector: (row) => row.assistanceName,
    cell: (row) => (
      <span className="fw-bolder">{row.assistanceName}</span>
    ),
  },
  {
    name: t("MentorCourseName"),
    sortable: true,
    minWidth: "250px",
    maxWidth: "300px",
    sortField: "courseName",
    selector: (row) => row.courseName,
    cell: (row) => (
      <span className="fw-bolder text-truncate" style={{ minWidth: 0 }}>
        {row.courseName ?? "-"}
      </span>
    ),
  },
  {
    name: t("InsertDate"),
    sortable: true,
    minWidth: "180px",
    sortField: "inserDate",
    selector: (row) => row.inserDate,
    cell: (row) => (
      <span>
        {row.inserDate
          ? new Date(row.inserDate).toLocaleDateString("fa-IR")
          : "-"}
      </span>
    ),
  },
  {
    name: t("Actions"),
    minWidth: "100px",
    cell: (row) => {
      const { t } = useTranslation();
      const { courseId } = useParams();
      const queryClient = useQueryClient();
      const [editModal, setEditModal] = useState(false);

      const usersData = queryClient.getQueryState(["UsersList"]);

      const userOptions = useMemo(
        () =>
          (usersData?.data?.data?.listUser ?? []).map((user) => ({
            value: user.id,
            label: `${user.fName} ${user.lName}`,
          })),
        [usersData]
      );

      const defaultValues = {
        id: row.id ?? "",
        userId: row.userId ?? null,
        courseId: courseId ?? "",
      };

      const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
      });

      const { mutate: updateMentorMutate } = useMutation({
        mutationFn: updateCourseAssistance,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          if (response.data.success) {
            toast.success(response.data.message, { id: context.toastId });
            queryClient.invalidateQueries({ queryKey: ["CourseAssistance"] });
            setEditModal(false);
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (_, context) => {
          toast.error(t("ErrorOccurred"), { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateMentorMutate(data);
      };

      return (
        <div className="d-flex align-items-center gap-1">
          <Edit
            size={17}
            className="me-50 cursor-pointer"
            onClick={() => setEditModal(true)}
          />

          <Modal
            unmountOnClose
            isOpen={editModal}
            toggle={() => setEditModal(!editModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setEditModal(!editModal)}>
              {t("EditMentor")}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="userId">
                    {t("SelectUser")}
                  </Label>
                  <Controller
                    name="userId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={userOptions}
                        className={`react-select ${errors.userId ? "is-invalid" : ""}`}
                        classNamePrefix="select"
                        id="userId"
                        name="userId"
                        theme={selectThemeColors}
                        value={userOptions.find((u) => u.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected?.value)}
                      />
                    )}
                  />
                  {errors.userId && (
                    <div className="invalid-feedback d-block">
                      {t(errors.userId.message)}
                    </div>
                  )}
                </Col>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={() => setEditModal(false)}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmit)}>
                {t("SaveChanges")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];