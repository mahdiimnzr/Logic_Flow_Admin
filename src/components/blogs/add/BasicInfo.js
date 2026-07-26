import { Fragment, useState, useEffect } from "react";
import {
  Label,
  Row,
  Col,
  Input,
  FormFeedback,
  Button,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller } from "react-hook-form";
import { getNewsCategories } from "../../../core/services/api/blogs/blogs.service";
import { useTranslation } from "react-i18next";

const BasicInfo = ({ stepper, control, errors, trigger }) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const data = await getNewsCategories();
      if (data) {
        setCategories(data);
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const handleNext = async () => {
    const isStepValid = await trigger([
      "title",
      "categoryId",
      "googleTitle",
      "keyword",
      "miniDescribe",
      "googleDescribe",
    ]);

    if (isStepValid) {
      stepper.next();
    }
  };

  return (
    <Fragment>
      <div className="content-header mb-2">
        <h5 className="mb-0"> {t("basicInfoTitle")}</h5>
        <small className="text-muted">{t("basicInfoDescription")}</small>
      </div>
      <Row>
        <Col md="6" className="mb-1">
          <Label className="form-label" for="title">
            {t("articleTitle")}
            <span className="text-danger">*</span>
          </Label>
          <Controller
            id="title"
            name="title"
            control={control}
            rules={{
              required: t("articleTitleRequired"),
              minLength: {
                value: 5,
                message: t("articleTitleMinLength"),
              },
            }}
            render={({ field }) => (
              <Input
                invalid={errors.title && true}
                {...field}
                placeholder={t("articleTitlePlaceholder")}
              />
            )}
          />
          {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
        </Col>

        <Col md="6" className="mb-1">
          <Label className="form-label" for="categoryId">
            {t("category")}
            <span className="text-danger">*</span>
            {isLoading && <Spinner size="sm" className="ms-1 text-primary" />}
          </Label>
          <Controller
            id="categoryId"
            name="categoryId"
            control={control}
            rules={{ required: t("categoryRequired") }}
            render={({ field: { onChange, value } }) => {
              const categoryOptions =
                categories?.map((ca) => ({
                  value: ca.id,
                  label: ca.categoryName,
                })) || [];
              const selectedOption =
                categoryOptions.find((c) => c.value === value) || null;
              return (
                <Select
                  isClearable={false}
                  classNamePrefix="select"
                  className={`react-select ${
                    errors.categoryId ? "is-invalid" : ""
                  }`}
                  options={categoryOptions}
                  value={selectedOption}
                  placeholder={isLoading ? t("loading") : t("selectCategory")}
                  isDisabled={isLoading}
                  onChange={(data) => {
                    onChange(data ? data.value : "");
                  }}
                />
              );
            }}
          />
          {errors.categoryId && (
            <FormFeedback className="d-block">
              {errors.categoryId.message}
            </FormFeedback>
          )}
        </Col>

        <Col md="6" className="mb-1">
          <Label className="form-label" for="googleTitle">
            {t("googleTitle")}(SEO)
          </Label>
          <Controller
            id="googleTitle"
            name="googleTitle"
            control={control}
            rules={{ required: t("googleTitleRequired") }}
            render={({ field }) => (
              <Input {...field} placeholder={t("googleTitlePlaceholder")} />
            )}
          />
          {errors.googleTitle && (
            <FormFeedback className="d-block">
              {errors.googleTitle.message}
            </FormFeedback>
          )}
        </Col>

        <Col md="6" className="mb-1">
          <Label className="form-label" for="keyword">
            {t("keywords")}
          </Label>
          <Controller
            id="keyword"
            name="keyword"
            control={control}
            rules={{ required: t("keywordsRequired") }}
            render={({ field }) => (
              <Input {...field} placeholder={t("keywordsPlaceholder")} />
            )}
          />
          {errors.keyword && (
            <FormFeedback className="d-block">
              {errors.keyword.message}
            </FormFeedback>
          )}
        </Col>

        <Col md="6" className="mb-1">
          <Label className="form-label" for="miniDescribe">
            {t("shortDescription")}
          </Label>
          <Controller
            id="miniDescribe"
            name="miniDescribe"
            control={control}
            rules={{
              required: t("shortDescriptionRequired"),
              minLength: {
                value: 20,
                message: t("shortDescriptionMinLength"),
              },
            }}
            render={({ field }) => (
              <Input
                type="textarea"
                rows="3"
                {...field}
                placeholder={t("shortDescriptionPlaceholder")}
              />
            )}
          />
          {errors.miniDescribe && (
            <FormFeedback className="d-block">
              {errors.miniDescribe.message}
            </FormFeedback>
          )}
        </Col>

        <Col md="6" className="mb-1">
          <Label className="form-label" for="googleDescribe">
            {t("shortDescriptionPlaceholder")}
          </Label>
          <Controller
            id="googleDescribe"
            name="googleDescribe"
            control={control}
            rules={{ required: t("googleDescriptionRequired") }}
            render={({ field }) => (
              <Input
                type="textarea"
                rows="3"
                {...field}
                placeholder={t("googleDescriptionPlaceholder")}
              />
            )}
          />
          {errors.googleDescribe && (
            <FormFeedback className="d-block">
              {errors.googleDescribe.message}
            </FormFeedback>
          )}
        </Col>

        <Col md="6" className="mb-1 mt-1">
          <div className="form-check form-switch">
            <Controller
              id="isSlider"
              name="isSlider"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  type="switch"
                  id="isSlider"
                  checked={value}
                  onChange={onChange}
                />
              )}
            />
            <Label className="form-check-label" for="isSlider">
              {t("showInSlider")}
            </Label>
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-2">
        <Button color="secondary" className="btn-prev" outline disabled>
          <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
          <span className="align-middle d-sm-inline-block d-none">
            {t("previous")}
          </span>
        </Button>
        <Button color="primary" className="btn-next" onClick={handleNext}>
          <span className="align-middle d-sm-inline-block d-none">
            {t("next")}
          </span>
          <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
        </Button>
      </div>
    </Fragment>
  );
};

export default BasicInfo;
