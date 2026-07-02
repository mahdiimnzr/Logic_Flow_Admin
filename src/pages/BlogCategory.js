import React, { useState } from 'react'
import { Row, Col, Button, Card, CardHeader, CardTitle } from 'reactstrap'
import { Layers, Plus } from 'react-feather'
import { useQuery } from '@tanstack/react-query'
import { getNewsCategories } from '../core/services/api/blogs/blogs.service'
import BlogFilterCard from '../components/blogs/BlogFilterCard'
import CategoryTable from '../components/blogs/category/CategoryTable'
import CategoryModal from '../components/blogs/category/CategoryModal'

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

    return (
        <div className='app-user-list'>
            <Row className='align-items-center mb-2'>
                <Col lg="4" md="6" sm="12" className='mb-2 mb-md-0'>
                    <BlogFilterCard
                        title="کل دسته‌بندی‌ها"
                        count={totalCategoriesCount}
                        icon={<Layers size={22} />}
                        color="primary"
                    />
                </Col>

                <Col lg="8" md="6" sm="12" className='d-flex justify-content-md-end justify-content-start'>
                    <Button color='primary' className='d-flex align-items-center' onClick={toggleModal}>
                        <Plus size={18} className='me-50' />
                        <span className='fw-bold'>افزودن دسته‌بندی جدید</span>
                    </Button>
                </Col>
            </Row>

            <CategoryTable
                data={categories || []}
                isLoading={isLoading}
                onEditClick={handleEditCategory}
            />
            <CategoryModal
                isOpen={isModalOpen}
                toggle={toggleModal}
                initialData={selectedCategory}
                refetch={refetch}
            />
        </div>
    )
}

export default BlogCategory