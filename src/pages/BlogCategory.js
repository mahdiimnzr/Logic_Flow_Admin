import { React, useState, Fragment } from 'react'
import { Row, Col, Button, Card, CardHeader, CardTitle } from 'reactstrap'
import { Layers, Plus } from 'react-feather'
import { useQuery } from '@tanstack/react-query'
import { getNewsCategories } from '../core/services/api/blogs/blogs.service'
import CategoryTable from '../components/blogs/category/CategoryTable'
import CategoryModal from '../components/blogs/category/CategoryModal'
import BreadCrumbs from "@components/breadcrumbs"
import SubscribersGained from '../components/blogs/category/SubscribersGained'

const BlogCategory = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState(null)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
        if (isModalOpen) setSelectedCategory(null)
    }

    const handleEditCategory = (categoryData) => {
        setSelectedCategory(categoryData)
        setIsModalOpen(true)
    }

    const { data: categories, isLoading, refetch } = useQuery({
        queryKey: ["newsCategories"],
        queryFn: getNewsCategories,
    })

    const totalCategoriesCount = categories ? categories.length : 0

    const categoryChartData = [
        {
            name: 'دسته‌بندی‌ها',
            data: [5, 12, 8, 15, 10, 22, 15]
        }
    ]

    return (
        <Fragment>

            <BreadCrumbs
                title="دسته بندی مقالات"
                data={[
                    { title: " مقالات", link: "/blogs/list" }, { title: "دسته بندی‌ها" }
                ]}
            />
            <div className='app-user-list'>
                <Row>
                    <Col xl="3" lg="4" md="4" sm="12" className="mb-2">
                        <div className="d-flex flex-column h-100">

                            <SubscribersGained
                                title="کل دسته‌بندی‌ها"
                                subscribers={totalCategoriesCount?.toString() || "0"}
                                series={categoryChartData}
                                color="primary"
                                icon={<Layers size={21} />}
                            />

                            <Button
                                color='primary'
                                className='w-100 mt-1 d-flex align-items-center justify-content-center'
                                onClick={toggleModal}
                            >
                                <Plus size={15} className='me-50' />
                                <span className='fw-bold'>افزودن دسته‌بندی جدید</span>
                            </Button>

                        </div>
                    </Col>

                    <Col xl="9" lg="8" md="8" sm="12">
                        <CategoryTable
                            data={categories || []}
                            isLoading={isLoading}
                            onEditClick={handleEditCategory}
                        />
                    </Col>
                </Row>

                <CategoryModal
                    isOpen={isModalOpen}
                    toggle={toggleModal}
                    initialData={selectedCategory}
                    refetch={refetch}
                />
            </div>
        </Fragment>
    )
}

export default BlogCategory