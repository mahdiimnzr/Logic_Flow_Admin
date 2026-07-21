import { Fragment } from "react";
import { Button, Row, Col, Card, CardBody, Badge } from "reactstrap";
import { ArrowLeft, ArrowRight, Check } from "react-feather";

import defaultIMG from "../../../assets/images/coursePng.png";
import HandleIdentityEditorJs from "../../common/EditorDetailValidation";
const baseURL = import.meta.env.VITE_BASE_URL || "";

const BlogPreview = ({ stepper, watch, onSubmit, isEditMode }) => {
  const data = watch();
  const getImageSrc = (image) => {
    if (!image) return null;

    if (typeof image === "string") {
      return image.startsWith("http") ? image : `${baseURL}/${image}`;
    }

    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    return null;
  };

  console.log(data.image);
  console.log(typeof data.image);
  console.log(data.image instanceof File);

  if (!data) return null;

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">پیش‌نمایش نهایی</h5>
        <small className="text-muted">
          اطلاعات را با دقت بررسی کرده و سپس ثبت نهایی را بزنید.
        </small>
      </div>

      <Card className="border my-2 shadow-none">
        <CardBody>
          <Row>
            <Col md="8">
              <h4 className="fw-bolder text-primary mb-1">
                {data.title || "بدون عنوان"}
              </h4>
              <div className="mb-2">
                <Badge color="light-secondary" className="me-1">
                  آیدی دسته‌بندی: {data.categoryId || "انتخاب نشده"}
                </Badge>
                {data.isSlider && (
                  <Badge color="light-warning">نمایش در اسلایدر</Badge>
                )}
              </div>

              <p className="text-muted fw-bold mb-50">چکیده:</p>
              <p>{data.miniDescribe || "بدون چکیده"}</p>

              <hr />

              <p className="text-muted fw-bold mb-50">اطلاعات سئو:</p>
              <ul className="list-unstyled mb-0">
                <li>
                  <span className="fw-bold">عنوان گوگل:</span>{" "}
                  {data.googleTitle || "-"}
                </li>
                <li>
                  <span className="fw-bold">کلمات کلیدی:</span>{" "}
                  {data.keyword || "-"}
                </li>
              </ul>
            </Col>

            <Col
              md="4"
              className="d-flex justify-content-center align-items-start mt-2 mt-md-0"
            >
              {data.image ? (
                <img
                  src={getImageSrc(data.image)}
                  alt="کاور مقاله"
                  className="img-fluid rounded shadow-sm"
                  style={{
                    maxHeight: "220px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultIMG;
                  }}
                />
              ) : (
                <div
                  className="bg-light d-flex justify-content-center align-items-center rounded w-100"
                  style={{ height: "200px" }}
                >
                  <span className="text-muted">عکسی انتخاب نشده</span>
                </div>
              )}
            </Col>
          </Row>

          <Row className="mt-3">
            <Col sm="12">
              <p className="text-muted fw-bold mb-50">محتوای اصلی مقاله:</p>
              <HandleIdentityEditorJs desc={data.describe} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between mt-2">
        <Button
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
          <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
          <span className="align-middle d-sm-inline-block d-none">قبلی</span>
        </Button>
        <Button color="success" className="btn-submit" onClick={onSubmit}>
          <Check size={14} className="align-middle me-sm-25 me-0" />
          <span className="align-middle d-sm-inline-block d-none">
            {isEditMode ? "اعمال تغییرات" : "ایجاد  مقاله"}
          </span>
        </Button>
      </div>
    </Fragment>
  );
};

export default BlogPreview;
