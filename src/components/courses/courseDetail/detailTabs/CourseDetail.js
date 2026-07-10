import { Fragment } from "react";
import StatsVertical from "@components/widgets/stats/StatsVertical";
import { Users, MessageSquare, UserCheck, Book } from "react-feather";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import HandleIdentityEditorJs from "../../../common/EditorDetailValidation";
const CourseDetail = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <Row>
        <Col xl="3" md="4" sm="6">
          <StatsVertical
            icon={<MessageSquare size={21} />}
            color="primary"
            stats={data?.courseCommentTotal}
            statTitle={t("CommentCount")}
          />
        </Col>
        <Col xl="3" md="4" sm="6">
          <StatsVertical
            icon={<UserCheck size={21} />}
            color="success"
            stats={data?.courseStudent?.length}
            statTitle={t("StudentCount")}
          />
        </Col>
        <Col xl="3" md="4" sm="6">
          <StatsVertical
            icon={<Book size={21} />}
            color="warning"
            stats={data?.reserveUserTotal}
            statTitle={t("ReserveCount")}
          />
        </Col>
        <Col xl="3" md="4" sm="6">
          <StatsVertical
            icon={<Users size={21} />}
            color="info"
            stats={data?.capacity}
            statTitle={t("CourseCapacity")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader tag={"h2"}>{t("CourseDetail")}</CardHeader>
            <CardBody>
              <CardTitle>{t("CourseTitle")}</CardTitle>
              <CardText tag={"h5"}>{data?.title}</CardText>
            </CardBody>
            <CardBody>
              <CardTitle>{t("CourseDescribe")}</CardTitle>
              <HandleIdentityEditorJs desc={data?.describe} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};
export default CourseDetail;
