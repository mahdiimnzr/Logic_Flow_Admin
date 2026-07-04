import { Fragment, React, useState } from 'react'
import { Row, Col } from 'reactstrap'
import { BookOpen, Activity, Slash } from 'react-feather'
import { title } from 'process';
import { useQueries } from '@tanstack/react-query'
import { getAdminBlogsList } from '../core/services/api/blogs/blogs.service'
import BlogFilterCard from '../components/blogs/BlogFilterCard'
import TableServerSide from '../components/blogs/TableServerSide'
import BreadCrumbs from "@components/breadcrumbs"



const BlogsList = () => {

    const [statusFilter, setStatusFilter] = useState(null);

    const results = useQueries({
        queries: [
            {
                queryKey: ["blogsCount", "total"],
                queryFn: () => getAdminBlogsList({ PageNumber: 1, RowsOfPage: 1 }),
            },
            {
                queryKey: ["blogsCount", "active"],
                queryFn: () => getAdminBlogsList({ PageNumber: 1, RowsOfPage: 1, IsActive: true }),
            },
            {
                queryKey: ["blogsCount", "inactive"],
                queryFn: () => getAdminBlogsList({ PageNumber: 1, RowsOfPage: 1, IsActive: false }),
            }
        ]
    })

    const totalBlogsCount = results[0].data?.totalCount || 0
    const activeBlogsCount = results[1].data?.totalCount || 0
    const inactiveBlogsCount = results[2].data?.totalCount || 0

    return (
        <Fragment>
            <BreadCrumbs
                title="لیست مقالات"
                data={[
                    { title: "مدیریت اخبار" }, { title: "لیست اخبار و مقالات" }
                ]}
            />

            <div className='app-user-list'>
                <Row>
                    <Col lg="4" sm="6">
                        <BlogFilterCard
                            title="مجموع اخبار و مقالات"
                            count={totalBlogsCount}
                            icon={<BookOpen size={22} />}
                            color="primary"
                            isActive={setStatusFilter === null}
                            onClick={() => setStatusFilter(null)}
                        />
                    </Col>
                    <Col lg="4" sm="6">
                        <BlogFilterCard
                            title="اخبار و مقالات فعال"
                            count={activeBlogsCount}
                            icon={<Activity size={22} />}
                            color="primary"
                            isActive={setStatusFilter === true}
                            onClick={() => setStatusFilter(true)}
                        />
                    </Col>
                    <Col lg="4" sm="6">
                        <BlogFilterCard
                            title="اخبار و مقالات غیر فعال"
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
    )
}

export default BlogsList