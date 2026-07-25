import { useState } from "react";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectThemeColors } from "@utils";
import { Users, Calendar, Tag, Star } from "react-feather";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
const orderOptions = (values) => {
  if (values.length > 0)
    return values
      .filter((v) => v.isFixed)
      .concat(values.filter((v) => !v.isFixed));
};
const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
};
import image from "../../../assets/images/coursePng.png";
import ImageFallback from "../../common/ImageFallback";
import formatPrice from "../../../core/utils/formatPrice";
import formatDate from "../../../core/utils/formatDate";
import {
  activeCourse,
  addCourseTechnology,
  updateCourseStatus,
} from "../../../core/services/api/CourseList/courseList.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import formDataConverter from "../../../core/utils/formDataConvertor";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCourseRecommended } from "../../../core/services/api/AI/ai.service";

const PreviewCard = ({
  courseDetail,
  comments,
  reserves,
  groups,
  socialGroup,
  mentors,
  assistance,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { courseId } = useParams();

  const Status = queryClient.getQueryState(["CourseStatus"]);
  const Category = queryClient.getQueryState(["Technology"]);

  const fundedCategories = (courseDetail?.courseTeches ?? [])
    .map((tech) => Category?.data?.data.find((value) => value.techName == tech))
    .filter(Boolean);

  const validationSchema = Yup.object({
    TechnologyIds: Yup.array()
      .min(1, t("CourseTechnologyIdRequired"))
      .required(t("CourseTechnologyIdRequired")),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { TechnologyIds: [] },
    resolver: yupResolver(validationSchema),
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [aiModal, setAiModal] = useState(false);
  const [aiText, setAiText] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(
    orderOptions(
      fundedCategories.map((value) => ({
        value: value.id,
        label: value.techName,
        isFixed: true,
      })),
    ),
  );
  const [selectedStatus, setSelectedStatus] = useState({
    value: courseDetail.statusId,
    label: courseDetail?.statusName,
  });

  const statusOptions = Status?.data?.data?.map((value) => ({
    value: value.id,
    label: value.statusName,
  }));

  const categoryOptions = Category?.data?.data?.map((value) => ({
    value: value.id,
    label: value.techName,
    isFixed: false,
  }));

  const toggleCategoryModal = () => setCategoryModalOpen((prev) => !prev);
  const toggleStatusModal = () => setStatusModalOpen((prev) => !prev);
  const toggleAiModal = () => setAiModal((prev) => !prev);

  const { mutate: activeCourseMutate } = useMutation({
    mutationFn: activeCourse,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response?.data?.success === true) {
        toast.success(response?.data?.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`CourseDetail-${courseId}`],
        });
      } else {
        toast.error(response?.data?.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response?.data?.message, { id: context.toastId });
    },
  });

  const { mutate: updateStatusCourseMutate } = useMutation({
    mutationFn: updateCourseStatus,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response?.data?.success === true) {
        toast.success(response?.data?.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`CourseDetail-${courseId}`],
        });
        toggleStatusModal();
      } else {
        toast.error(response?.data?.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response?.data?.message, { id: context.toastId });
    },
  });

  const { mutate: addTechnologies } = useMutation({
    mutationFn: addCourseTechnology,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      if (response.data.success) {
        toast.success(response?.data?.message, { id: context.toastId });
        queryClient.invalidateQueries({
          queryKey: [`CourseDetail-${courseId}`],
        });
        setSelectedCategory((prev) =>
          prev.map((value) => ({ ...value, isFixed: true })),
        );
        toggleCategoryModal();
      } else {
        toast.error(response?.data?.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response?.data?.message ?? t("ErrorOccurred"), {
        id: context.toastId,
      });
    },
  });
  const { mutate: aiMutate } = useMutation({
    mutationFn: getCourseRecommended,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success(t("AIIsReady"), {
        id: context.toastId,
      });
      setAiText(response.data.choices[0].message.content);
      toggleAiModal();
    },
    onError: (response, _, context) => {
      toast.error(t("ErrorOccurred"), {
        id: context.toastId,
      });
    },
  });

  const fixedOnChange = (value, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) return;
        break;
      case "clear":
        value = categoryOptions.filter((v) => v.isFixed);
        break;
      default:
        break;
    }

    value = orderOptions(value);
    setSelectedCategory(value);
    const newTechnologies = value
      .filter((item) => !item.isFixed)
      .map((item) => ({ techId: item.value }));
    setValue("TechnologyIds", newTechnologies);
  };

  const onSubmit = (data) => {
    addTechnologies({ courseId, body: data.TechnologyIds });
  };

  const handleToggleActive = () => {
    activeCourseMutate({
      active: courseDetail.active === true ? false : true,
      id: courseId,
    });
  };

  return (
    <>
      <Card className="invoice-preview-card overflow-hidden">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "190px",
            background:
              "linear-gradient(180deg, rgba(20,20,30,0) 40%, rgba(20,20,30,0.55) 100%)",
          }}
        >
          <ImageFallback
            src={courseDetail?.imageAddress}
            fallback={image}
            style={{ width: "100%", height: "190px", objectFit: "cover" }}
          />
          <Badge
            color={courseDetail?.active ? "success" : "secondary"}
            pill
            className="px-2 py-50"
            style={{
              position: "absolute",
              top: "12px",
              insetInlineStart: "12px",
              fontSize: "0.75rem",
            }}
          >
            {courseDetail?.active ? t("Active") : t("DeActive")}
          </Badge>
        </div>
        <CardBody className="invoice-padding pb-1 pt-2">
          <h4 className="mb-0 fw-bold">{courseDetail?.title}</h4>
          <CardText className="text-muted mb-2">
            {courseDetail?.teacherName}
          </CardText>
          <Row className="g-1 mb-2 text-center">
            <Col xs="6">
              <div className="border rounded-2 py-1">
                <Users size={16} className="mb-25" />
                <div className="small text-muted">{t("CourseGroups")}</div>
                <div className="fw-bold">
                  {courseDetail?.courseGroupTotal ?? 0}
                </div>
              </div>
            </Col>
            <Col xs="6">
              <div className="border rounded-2 py-1">
                <Star size={16} className="mb-25" />
                <div className="small text-muted">{t("Rate")}</div>
                <div className="fw-bold">{courseDetail?.courseRate ?? 0}</div>
              </div>
            </Col>
          </Row>
        </CardBody>
        <hr className="my-0" />
        <CardBody className="invoice-padding py-1">
          <h6 className="text-uppercase text-muted mb-1 mt-1">{t("Detail")}</h6>
          <div className="d-flex align-items-center justify-content-between py-50">
            <span className="text-muted d-flex align-items-center">
              {t("CourseStatus")}:
            </span>
            <span className="fw-semibold">
              {courseDetail?.statusName ?? "—"}
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-50">
            <span className="text-muted d-flex align-items-center">
              {t("CourseCost")}:
            </span>
            <span className="fw-semibold">
              {formatPrice(courseDetail?.cost) ?? "—"}
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-50">
            <span className="text-muted d-flex align-items-center">
              <Calendar size={14} className="me-50" />
              {t("CourseStartTime")}:
            </span>
            <span className="fw-semibold">
              {formatDate(courseDetail?.startTime) ?? "—"}
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between py-50">
            <span className="text-muted d-flex align-items-center">
              <Calendar size={14} className="me-50" />
              {t("CourseEndTime")}:
            </span>
            <span className="fw-semibold">
              {formatDate(courseDetail?.endTime) ?? "—"}
            </span>
          </div>
        </CardBody>
        <hr className="my-0" />
        <CardBody className="invoice-padding pt-1">
          <Row className="g-1">
            <Col xs="12">
              <Link to={`/Courses/Edit/${courseDetail?.courseId}`}>
                <Button
                  color="primary"
                  block
                  className="d-flex align-items-center justify-content-center gap-1"
                >
                  {t("Edit")}
                </Button>
              </Link>
            </Col>
            <Col xs="12">
              <Button
                color={courseDetail?.active ? "danger" : "success"}
                block
                className="d-flex align-items-center justify-content-center gap-1"
                onClick={handleToggleActive}
              >
                {courseDetail?.active ? t("DeActive") : t("Active")}
              </Button>
            </Col>
            <Col xs="12">
              <Button
                color="info"
                block
                className="d-flex align-items-center justify-content-center gap-1"
                onClick={toggleCategoryModal}
              >
                {t("AddCourseTechCategory")}
              </Button>
            </Col>
            <Col xs="12">
              <Button
                color="warning"
                block
                className="d-flex align-items-center justify-content-center gap-1"
                onClick={toggleStatusModal}
              >
                {t("CourseStatus")}
              </Button>
            </Col>
            <Col xs="12">
              <Button
                color="success"
                block
                className="d-flex align-items-center justify-content-center gap-1"
                onClick={() => {
                  aiMutate([
                    {
                      role: "user",
                      content: `من ادمینم اطلاعات ${JSON.stringify(
                        courseDetail ?? "[]",
                      )} کامنت ها ${JSON.stringify(
                        comments ?? "[]",
                      )}گروه ها ${JSON.stringify(
                        groups ?? "[]",
                      )} منتور ها ${JSON.stringify(
                        socialGroup ?? "[]",
                      )} وظایف منتور ها ${JSON.stringify(assistance ?? "[]")}`,
                    },
                  ]);
                }}
              >
                {t("AIAnalystic")}
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Modal
        unmountOnClose={true}
        isOpen={categoryModalOpen}
        toggle={toggleCategoryModal}
        className="modal-dialog-centered"
        style={{ fontFamily: "IRANYekanXFaNum" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleCategoryModal}>
            <Tag size={18} className="me-50" />
            {t("AddCourseTechCategory")}
          </ModalHeader>
          <ModalBody>
            <p className="text-muted mb-1">
              {t("AddCourseTechCategorySubtitle")}
            </p>
            <Label for="role-select">{t("CourseCategoryId")}</Label>
            <Controller
              name="TechnologyIds"
              control={control}
              render={({ field }) => (
                <Select
                  isClearable={false}
                  value={selectedCategory}
                  styles={styles}
                  isMulti
                  onChange={fixedOnChange}
                  theme={selectThemeColors}
                  name="categories"
                  className={`react-select ${
                    errors.TechnologyIds ? "is-invalid" : ""
                  }`}
                  placeholder={t("CourseTechnologySelectPlaceholder")}
                  classNamePrefix="select"
                  options={categoryOptions}
                  components={animatedComponents}
                />
              )}
            />
            {errors.TechnologyIds && (
              <div className="invalid-feedback d-block">
                {errors.TechnologyIds.message}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={toggleCategoryModal}>
              {t("Cancel")}
            </Button>
            <Button type="submit" color="primary">
              {t("SaveChanges")}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
      <Modal
        unmountOnClose={true}
        isOpen={statusModalOpen}
        toggle={toggleStatusModal}
        className="modal-dialog-centered"
        style={{ fontFamily: "IRANYekanXFaNum" }}
      >
        <ModalHeader toggle={toggleStatusModal}>
          {t("CourseStatus")}
        </ModalHeader>
        <ModalBody>
          <p className="text-muted mb-1">{t("ApplyStatus")}</p>
          <Label for="role-select">{t("CourseStatusId")}</Label>
          <Select
            isClearable={false}
            value={selectedStatus}
            options={statusOptions}
            className="react-select"
            classNamePrefix="select"
            theme={selectThemeColors}
            onChange={(data) => setSelectedStatus(data)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              const values = {
                CourseId: courseDetail.courseId,
                StatusId: selectedStatus.value,
              };
              const formData = formDataConverter(values);
              selectedStatus.value == ""
                ? null
                : updateStatusCourseMutate(formData);
            }}
          >
            {t("ApplyStatus")}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        unmountOnClose={true}
        isOpen={aiModal}
        toggle={toggleAiModal}
        className="modal-dialog-centered"
        style={{ fontFamily: "IRANYekanXFaNum" }}
      >
        <ModalHeader toggle={toggleAiModal}>{t("AIAnalystic")}</ModalHeader>
        <ModalBody>
          <Label for="role-select">{t("AI")}</Label>
          <p className="form-control-static" id="StaticInput">
            {aiText}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggleAiModal}>
            {t("Cancel")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PreviewCard;
