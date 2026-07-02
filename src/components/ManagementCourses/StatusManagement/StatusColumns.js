// ** React Imports

import { useForm, Controller } from "react-hook-form";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Icons Imports
import { Edit } from "react-feather";

// ** Reactstrap Imports
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

import { useSelector } from "react-redux";
import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { updateStatus } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";

const validationSchema = Yup.object({
  statusName: Yup.string().required("CourseTitleRequired"),
  describe: Yup.string().required(" توضیات الزامی است"),
  statusNumber: Yup.string().required(" توضیات الزامی است"),
});

// ** Renders Client Columns
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
  } else {
    return (
      <Avatar
        initials
        className="me-1"
        color={row.avatarColor || "light-primary"}
        content={
          row?.techName?.toUpperCase() + row?.lName?.toUpperCase() || "Unknown"
        }
      />
    );
  }
};
export const columns = [
  {
    name: "",
    sortable: true,
    minWidth: "200px",
    sortField: "iconAddress",
    selector: (row) => row.iconAddress,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        {/* <div className="d-flex flex-column">
          <span className="text-truncate text-muted mb-0">{row.techName}</span>
        </div> */}
      </div>
    ),
  },

  {
    name: "وضعیت ها",
    minWidth: "80px",
    sortable: true,
    sortField: "statusName",
    selector: (row) => row.statusName,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.statusName}</span>
    ),
  },

  {
    name: "اقدام",
    minWidth: "50px",
    cell: (row) => {
      const { t } = useTranslation();
      const [centeredModal, setCenteredModal] = useState(false);

      // ** States
      const [show, setShow] = useState(false);
      const queryClient = useQueryClient();

      const defaultValues = {
        statusName: row.statusName ?? "",
        describe: row.describe ?? "",
        statusNumber: row.statusNumber ?? "",
        id: row.id ?? "",
      };

      // ** Hooks
      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

      const { mutate: updateStatusMutate } = useMutation({
        mutationFn: updateStatus,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          toast.success("وضعیت ویرایش شد", { id: context.toastId });
          queryClient.invalidateQueries({
            queryKey: [`Status`],
          });
          setShow(!show);
        },
        onError: (response, _, context) => {
          toast.error(response.data.message, { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateStatusMutate(data);
      };

      return (
        <div className="column-action d-flex gap-1">
          ویرایش
          <Edit size={17} className="me-50 " onClick={() => setShow(true)} />
          <Modal
            isOpen={show}
            toggle={() => setShow(!show)}
            className="modal-dialog-centered modal-lg"
          >
            <ModalHeader
              className="bg-transparent"
              toggle={() => setShow(!show)}
            ></ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-5">
              <div className="text-center mb-2">
                <h1 className="mb-1">ادیت کردن تکنولوژی ها</h1>
              </div>
              <Row
                tag="form"
                className="gy-1 pt-75"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Col xs={12}>
                  <Label className="form-label" for="statusName">
                    نام وضعبت
                  </Label>
                  <Controller
                    name="statusName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="statusName"
                        placeholder="   نام تکنولوژی"
                        invalid={errors.statusName && true}
                      />
                    )}
                  />
                  {errors.statusName && (
                    <FormFeedback>Please enter a valid Username</FormFeedback>
                  )}
                </Col>
                <Col xs={12}>
                  <Label className="form-label" for="describe">
                    توضیحات
                  </Label>
                  <Controller
                    name="describe"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="describe"
                        placeholder="توضیحات"
                        invalid={errors.describe && true}
                      />
                    )}
                  />
                  {errors.describe && (
                    <FormFeedback>Please enter a valid Username</FormFeedback>
                  )}
                </Col>
                <Col xs={12}>
                  <Label className="form-label" for="statusNumber">
                    عدد
                  </Label>
                  <Controller
                    name="statusNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="statusNumber"
                        placeholder="statusNumber"
                        invalid={errors.describe && true}
                      />
                    )}
                  />
                  {errors.describe && (
                    <FormFeedback>Please enter a valid Username</FormFeedback>
                  )}
                </Col>

                <Col xs={12} className="text-center mt-2 pt-50">
                  <Button type="submit" className="me-1" color="primary">
                    تغیرات
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    onClick={() => setShow(false)}
                  >
                    منصرف
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
