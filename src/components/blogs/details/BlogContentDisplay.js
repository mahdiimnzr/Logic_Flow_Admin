import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import HandleIdentityEditorJs from "../../common/EditorDetailValidation";
import { useTranslation } from "react-i18next";

const BlogContentDisplay = ({ content }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="border-bottom mb-1">
        <CardTitle tag="h4">{t("BlogContent")}</CardTitle>
      </CardHeader>
      <CardBody>
        {content ? (
          <HandleIdentityEditorJs desc={content} />
        ) : (
          <div className="text-center text-muted py-5">
            {t("BlogNoContent")}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default BlogContentDisplay;
