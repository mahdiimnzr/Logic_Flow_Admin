import { Fragment, useState } from "react";
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectThemeColors } from "@utils";
import { Label, Row, Col, Button, Form } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import { useGetCourseAdd } from "../../../../core/services/api/CourseList/courseList.service";
import { useDispatch } from "react-redux";
import { updateAddCourseSliceParams } from "../../../../redux/actions";
import { useTranslation } from "react-i18next";

const animatedComponents = makeAnimated();

const defaultValues = {
  TechnologyIds: [],
};

const TechCategory = ({ stepper }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const SignupSchema = yup.object({
    TechnologyIds: yup
      .array()
      .min(1, t("CourseTechnologyIdRequired"))
      .required(t("CourseTechnologyIdRequired")),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (value) => {
    dispatch(
      updateAddCourseSliceParams({
        key: "TechnologyIds",
        value: value.TechnologyIds,
      }),
    );
    stepper.next();
  };

  const { data: courseAdd } = useGetCourseAdd();

  const [selectedTechnologies, setSelectedTechnologies] = useState([]);

  const technologyList = courseAdd?.data?.technologyDtos?.map((item) => ({
    value: item.id,
    label: item.techName,
  }));

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">{t("AddCourseTechCategory")}</h5>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm="12" className="mb-1">
            <Label for="TechnologyIds">{t("CourseTechnologyId")}</Label>
            <Controller
              name="TechnologyIds"
              control={control}
              render={({ field }) => (
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  isMulti
                  options={technologyList}
                  value={selectedTechnologies}
                  className={`react-select ${
                    errors.TechnologyIds ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  placeholder={t("CourseTechnologySelectPlaceholder")}
                  onChange={(data) => {
                    setSelectedTechnologies(data);
                    setValue(
                      "TechnologyIds",
                      data.map((item) => ({ techId: item.value })),
                      { shouldValidate: true },
                    );
                  }}
                />
              )}
            />
            {errors.TechnologyIds && (
              <div className="invalid-feedback d-block">
                {errors.TechnologyIds.message}
              </div>
            )}
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
            <span className="align-middle d-sm-inline-block d-none">
              {t("Previous")}
            </span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">
              {t("Next")}
            </span>
            <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default TechCategory;
