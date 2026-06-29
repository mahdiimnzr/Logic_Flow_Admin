// ** React Imports
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

// ** Custom Components
import Avatar from "@components/avatar";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Icons Imports
import { Edit } from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import { useTranslation } from "react-i18next";
// import formatDate from "../../core/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

import { useSelector } from "react-redux";
import profile from "/public/Profile.png";
import ImageFallback from "../../common/ImageFallback";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { updateTechnology } from "../../../core/services/api/TechnologyManagement/Technology.service";
import ImageDropZone from "../../common/ImageDropZone";

const validationSchema = Yup.object({
  techName: Yup.string().required("CourseTitleRequired"),
  describe: Yup.string().required("CourseDescribeRequired"),
  iconAddress: Yup.string().required(" عکس الزامی است"),
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
// const renderRole = (row) => {
//   return (
//     <span className={`text-truncate text-capitalize align-middle text-primary`}>
//       {row.join(", ")}
//     </span>
//   );
// };

// const statusObj = {
//   active: "light-success",
//   deActive: "light-secondary",
// };

export const columns = [
  {
    name: "تکنولوژی",
    sortable: true,
    minWidth: "200px",
    sortField: "iconAddress",
    selector: (row) => row.iconAddress,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            // to={`/Users/Detail/${row.id}`}
            className="user_name text-truncate text-body"
            // onClick={() => store.dispatch(getUser(row.id))}
          >
            <span className="text-truncate text-muted mb-0">
              {row.techName}
            </span>
          </Link>
        </div>
      </div>
    ),
  },

  {
    name: "توضیحات تکنولوژی",
    minWidth: "80px",
    sortable: true,
    sortField: "describe",
    selector: (row) => row.describe,
    cell: (row) => (
      <span className="text-truncate text-muted mb-0">{row.describe}</span>
    ),
  },

  {
    name: "اقدام",
    minWidth: "50px",
    cell: (row) => {
      // const params = useSelector((state) => state.usersSlice.params);
      const { t } = useTranslation();
      const [centeredModal, setCenteredModal] = useState(false);

      // ** States
      const [show, setShow] = useState(false);
      const queryClient = useQueryClient();

      const defaultValues = {
        techName: row.techName ?? "",
        describe: row.describe ?? "",
        iconAddress: row.iconAddress ?? "",
        // parentId: "",
        id: row.id ?? "",
      };

      // ** Hooks
      const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

      const { mutate: updateTechnologyMutate } = useMutation({
        mutationFn: updateTechnology,
        onMutate: () => {
          const toastId = toast.loading(t("Loading"));
          return { toastId };
        },
        onSuccess: (response, _, context) => {
          toast.success(" تکنولوژی ویرایش شد", { id: context.toastId });
          queryClient.invalidateQueries({
            queryKey: [`Technology`],
          });
          setShow(!show);
        },
        onError: (response, _, context) => {
          toast.error(response.data.message, { id: context.toastId });
        },
      });

      const onSubmit = (data) => {
        updateTechnologyMutate(data);
      };

      return (
        <div className="column-action d-flex gap-1">
          <Edit size={17} className="me-50" onClick={() => setShow(true)} />

          <Button.Ripple
            onClick={() => setCenteredModal(!centeredModal)}
            color="info"
            size="sm"
          >
            {" "}
            جزعیات
          </Button.Ripple>

          <Modal
            unmountOnClose={true}
            isOpen={centeredModal}
            toggle={() => setCenteredModal(!centeredModal)}
            className="modal-dialog-centered"
            style={{ fontFamily: "IRANYekanXFaNum" }}
          >
            <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
              {t("Comments")}
            </ModalHeader>
            <ModalBody>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("CommentTitle")}</Label>
                <span className="text-muted mb-0">{row.techName}</span>
              </div>
              <div className="mb-1 d-flex flex-column">
                <Label>{t("CommentDescribe")}</Label>
                <span className="text-muted mb-0">{row.describe}</span>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => setCenteredModal(!centeredModal)}
              >
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </Modal>

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
                  <Label className="form-label" for="techName">
                    نام تکنولوژی
                  </Label>
                  <Controller
                    name="techName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="techName"
                        placeholder="   نام تکنولوژی"
                        invalid={errors.techName && true}
                      />
                    )}
                  />
                  {errors.techName && (
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
                  <ImageDropZone
                    currentImage={row?.iconAddress}
                    error={
                      errors.iconAddress ? t(errors.iconAddress.message) : null
                    }
                    onChange={(files) => {
                      if (files.length > 0) {
                        setValue("iconAddress", URL.createObjectURL(files[0]), {
                          shouldValidate: true,
                        });
                      } else {
                        setValue("iconAddress", "", { shouldValidate: true });
                      }
                    }}
                  />
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
