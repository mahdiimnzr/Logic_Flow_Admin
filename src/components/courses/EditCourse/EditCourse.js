import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import AccountDetails from "./steps-with-validation/AccountDetails";
import PersonalInfo from "./steps-with-validation/PersonalInfo";
import SeoDetails from "./steps-with-validation/SeoDetails";
import ReviewSubmit from "./steps-with-validation/ReviewSubmit";
import { useTranslation } from "react-i18next";

const EditCourse = ({ data, usersList }) => {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const { t } = useTranslation();

  const steps = [
    {
      id: "course-info",
      title: t("EditCourseInfo"),
      subtitle: t("EditCourseInfoSubtitle"),
      content: <AccountDetails data={data} stepper={stepper} />,
    },
    {
      id: "course-details",
      title: t("EditCourseDetails"),
      subtitle: t("EditCourseDetailsSubtitle"),
      content: (
        <PersonalInfo data={data} usersList={usersList} stepper={stepper} />
      ),
    },
    {
      id: "course-seo",
      title: t("EditCourseSeoDetails"),
      subtitle: t("EditCourseSeoDetailsSubtitle"),
      content: <SeoDetails data={data} stepper={stepper} />,
    },
    {
      id: "review",
      title: t("ReviewCourse"),
      subtitle: t("ReviewCourseSubtitle"),
      content: <ReviewSubmit usersList={usersList} stepper={stepper} />,
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
};

export default EditCourse;
