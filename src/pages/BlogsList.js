import { Fragment, React, useState } from "react";
import { Row, Col } from "reactstrap";
import { BookOpen, Activity, Slash } from "react-feather";
import { title } from "process";
import { useQueries } from "@tanstack/react-query";
import { getAdminBlogsList } from "../core/services/api/blogs/blogs.service";
import BlogFilterCard from "../components/blogs/BlogFilterCard";
import TableServerSide from "../components/blogs/TableServerSide";
import BreadCrumbs from "@components/breadcrumbs";
import { useTranslation } from "react-i18next";

const BlogsList = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState(null);

  const results = useQueries({
    queries: [
      {
        queryKey: ["blogsCount", "total"],
        queryFn: () => getAdminBlogsList({ PageNumber: 1, RowsOfPage: 1 }),
      },
      {
        queryKey: ["blogsCount", "active"],
        queryFn: () =>
          getAdminBlogsList({ PageNumber: 1, RowsOfPage: 1, IsActive: true }),
      },
      {
        queryKey: ["blogsCount", "inactive"],
        queryFn: () =>
          getAdminBlogsList({ PageNumber: 1, RowsOfPage: 1, IsActive: false }),
      },
    ],
  });

  const totalBlogsCount = results[0].data?.totalCount || 0;
  const activeBlogsCount = results[1].data?.totalCount || 0;
  const inactiveBlogsCount = results[2].data?.totalCount || 0;

  return (
    <Fragment>
      <BreadCrumbs
        title={t("BlogsList")}
        data={[{ title: t("BlogsManagement") }, { title: t("BlogsListTitle") }]}
      />

      <div className="app-user-list">
        <Row>
          <Col lg="4" sm="6">
            <BlogFilterCard
              title={t("TotalBlogs")}
              count={totalBlogsCount}
              icon={<BookOpen size={22} />}
              color="primary"
              isActive={setStatusFilter === null}
              onClick={() => setStatusFilter(null)}
            />
          </Col>
          <Col lg="4" sm="6">
            <BlogFilterCard
              title={t("ActiveBlogs")}
              count={activeBlogsCount}
              icon={<Activity size={22} />}
              color="primary"
              isActive={setStatusFilter === true}
              onClick={() => setStatusFilter(true)}
            />
          </Col>
          <Col lg="4" sm="6">
            <BlogFilterCard
              title={t("InactiveBlogs")}
              count={inactiveBlogsCount}
              icon={<Slash size={22} />}
              color="primary"
              isActive={setStatusFilter === false}
              onClick={() => setStatusFilter(false)}
            />
          </Col>
        </Row>
        <TableServerSide statusFilter={statusFilter} />
      </div>
    </Fragment>
  );
};

export default BlogsList;
