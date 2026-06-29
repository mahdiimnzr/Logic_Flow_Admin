import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import AccountDetails from "./steps-with-validation/AccountDetails";
import PersonalInfo from "./steps-with-validation/PersonalInfo";
import SeoDetails from "./steps-with-validation/SeoDetails";
import TechCategory from "./steps-with-validation/TechCategory";
import ReviewSubmit from "./steps-with-validation/ReviewSubmit";
import { useTranslation } from "react-i18next";

const AddCourse = () => {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const { t } = useTranslation();

  const steps = [
    {
      id: "account-details",
      title: t("AddCourseInfo"),
      subtitle: t("AddCourseInfoSubtitle"),
      content: <AccountDetails stepper={stepper} />,
    },
    {
      id: "personal-info",
      title: t("AddCourseDetails"),
      subtitle: t("AddCourseDetailsSubtitle"),
      content: <PersonalInfo stepper={stepper} />,
    },
    {
      id: "seo-details",
      title: t("AddCourseSeoDetails"),
      subtitle: t("AddCourseSeoDetailsSubtitle"),
      content: <SeoDetails stepper={stepper} />,
    },
    {
      id: "tech-category",
      title: t("AddCourseTechCategory"),
      subtitle: t("AddCourseTechCategorySubtitle"),
      content: <TechCategory stepper={stepper} />,
    },
    {
      id: "review-submit",
      title: t("ReviewCourse"),
      subtitle: t("ReviewCourseSubtitle"),
      content: <ReviewSubmit stepper={stepper} />,
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
};

export default AddCourse;
