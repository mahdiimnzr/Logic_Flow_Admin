import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, Table, Badge } from "reactstrap";

const LatestCoursesTable = ({ courses = [] }) => {
  const { t } = useTranslation();
  return (
    <Card className="card-company-table h-100">
      <CardHeader>
        <CardTitle tag="h4">{t("DashboardsLatestCourses")}</CardTitle>
      </CardHeader>

      <div className="table-responsive">
        <Table hover borderless className="mb-0">
          <thead className="table-light">
            <tr>
              <th>{t("DashboardsCourseName")} </th>
              <th>{t("CourseTeacher")}</th>
              <th>
                {t("Price")} {t("Toman")}
              </th>
              <th>{t("Statuses")}</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.courseId}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar rounded bg-light-primary me-1">
                        <div className="avatar-content">
                          {course.tumbImageAddress &&
                          course.tumbImageAddress !== "null" ? (
                            <img
                              src={course.tumbImageAddress}
                              alt={course.title}
                              width="32"
                              height="32"
                              className="rounded"
                            />
                          ) : (
                            <span className="text-primary fw-bolder">
                              {course.title.substring(0, 1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="fw-bolder">{course.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted">
                      {course.fullName ||
                        (course.teacher && course.teacher.fullName) ||
                        t("Unspecified")}
                    </span>
                  </td>
                  <td>
                    <span className="fw-bolder text-heading">
                      {course.cost === 0
                        ? t("Free")
                        : course.cost.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <Badge
                      color={
                        course.isActive ? "light-success" : "light-secondary"
                      }
                      pill
                    >
                      {course.isActive ? t("Active") : t("DeActive")}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3 text-muted">
                  {t("NotFound")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default LatestCoursesTable;
