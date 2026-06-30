import { Link, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
} from "reactstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { updateCourseAssistance } from "../../../../core/services/api/CourseList/courseList.service";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const validationSchema = Yup.object({
  userId: Yup.number().typeError("UserIdRequired").required("UserIdRequired"),
});

export const columns = [
  {
    name: "MentorName",
    sortable: true,
    minWidth: "200px",
    maxWidth: "250px",
    sortField: "assistanceName",
    selector: (row) => row.assistanceName,
    cell: (row) => (
      <Link
        to={`/Users/Detail/${row.userId}`}
        className="user_name text-body text-truncate"
      >
        <span className="fw-bolder">{row.assistanceName}</span>
      </Link>
    ),
  },
  {
    name: "MentorCourseName",
    sortable: true,
    minWidth: "250px",
    maxWidth: "300px",
    sortField: "courseName",
    selector: (row) => row.courseName,
    cell: (row) => (
      <span
        className="fw-bolder text-truncate d-block w-100"
        style={{ minWidth: 0 }}
      >
        {row.courseName ?? "-"}
      </span>
    ),
  },
  {
    name: "InsertDate",
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
    name: "Actions",
    minWidth: "100px",
    cell: (row) => {
      const { t } = useTranslation();
      const { courseId } = useParams();
      const queryClient = useQueryClient();
      const [centeredModal, setCenteredModal] = useState(false);

      const usersData = queryClient.getQueryState(["UsersList"]);
      const [currentUser, setCurrentUser] = useState({
        value: row.userId,
        label: row.assistanceName,
      });
      const userOptions = useMemo(
        () =>
          (usersData?.data?.data?.listUser ?? []).map((user) => ({
            value: user.id,
            label: user.fName + " " + user.lName,
          })),
        [usersData],
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
      } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

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
            setCenteredModal(false);
          } else {
            toast.error(response.data.message, { id: context.toastId });
          }
        },
        onError: (response, _, context) => {
          toast.error(response.data.message, { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateMentorMutate(data);
      };

      const handleToggle = () => setCenteredModal(!centeredModal);

      return (
        <div className="d-flex align-items-center gap-1">
          <Button.Ripple onClick={handleToggle} color="primary" size="sm">
            {t("Edit")}
          </Button.Ripple>

          <Modal
            unmountOnClose={true}
            isOpen={centeredModal}
            toggle={handleToggle}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={handleToggle}>{t("EditMentor")}</ModalHeader>
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
                      <>
                        <Select
                          inputId="userId"
                          options={userOptions}
                          className={`react-select ${
                            errors.userId ? "is-invalid" : ""
                          }`}
                          classNamePrefix="select"
                          value={currentUser}
                          defaultValue={{
                            value: row.userId,
                            label: row.assistanceName,
                          }}
                          onChange={(selected) => {
                            setCurrentUser(selected);
                            field.onChange(selected ? selected.value : null);
                          }}
                        />
                        {errors.userId && (
                          <div
                            className="text-danger"
                            style={{ fontSize: "12px", marginTop: "4px" }}
                          >
                            {t(errors.userId.message)}
                          </div>
                        )}
                      </>
                    )}
                  />
                </Col>
              </form>
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
              <Button color="secondary" outline onClick={handleToggle}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmit)}>
                {t("ApplyStatus")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    },
  },
];
