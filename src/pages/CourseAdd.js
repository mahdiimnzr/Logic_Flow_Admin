// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Demo Components
import WizardHorizontal from "../components/courses/add/AddCourse";
// ** Demo Components
import Spinner from "@components/spinner/Fallback-spinner";

// ** Custom Components
import BreadCrumbs from "@components/breadcrumbs";
import { useGetCourseAdd } from "../core/services/api/CourseList/courseList.service";

const CourseAdd = () => {
  //   const { t } = useTranslation();

  const { isLoading } = useGetCourseAdd();

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <BreadCrumbs
        title="ساخت دوره"
        data={[
          { title: "دوره ها", link: "/courses/List" },
          { title: "ساخت دوره" },
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
