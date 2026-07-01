import { Fragment } from "react";
import { Row, Col } from "reactstrap";
import WizardHorizontal from "../components/courses/add/AddCourse";
import Spinner from "@components/spinner/Fallback-spinner";
import BreadCrumbs from "@components/breadcrumbs";
import { useGetCourseAdd } from "../core/services/api/CourseList/courseList.service";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CourseAdd = () => {
  const { t } = useTranslation();
  const { isLoading } = useGetCourseAdd();

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <BreadCrumbs
        title={t("CreateNewCourse")}
        data={[
          { title: t("Courses"), link: "/courses/List" },
          { title: t("CreateNewCourse") },
        ]}
      />
      <Row>
        <Col sm="12">
          <WizardHorizontal />
        </Col>
      </Row>
    </Fragment>
  );
};

export default CourseAdd;
