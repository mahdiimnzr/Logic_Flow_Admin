import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, FormFeedback, Row, Col, Spinner } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import { createNewsCategory, updateNewsCategory } from '../../../core/services/api/blogs/blogs.service'

const CategoryModal = ({ isOpen, toggle, initialData, refetch }) => {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const isEditMode = !!initialData

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            CategoryName: "",
            GoogleTitle: "",
            GoogleDescribe: "",
            IconName: "default-icon",
            IconAddress: "default-address",
            Image: "default-image"
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                reset({
                    CategoryName: initialData.categoryName || "",
                    GoogleTitle: initialData.googleTitle || "",
                    GoogleDescribe: initialData.GoogleDescribe || "",
                    IconName: initialData.iconName || "icon",
                    IconAddress: initialData.iconAddress || "address",
                    Image: initialData.image || "image"
                })
            } else {
                reset({
                    CategoryName: "",
                    GoogleTitle: "",
                    GoogleDescribe: "",
                    IconName: "icon",
                    IconAddress: "address",
                    Image: "image"
                })
            }
        }
    }, [isOpen, isEditMode, initialData, reset])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const formData = new FormData()

        formData.append("CategoryName", data.CategoryName)
        formData.append("GoogleTitle", data.GoogleTitle)
        formData.append("GoogleDescribe", data.GoogleDescribe)
        formData.append("IconName", data.IconName)
        formData.append("IconAddress", data.IconAddress)

        if (data.Image && data.Image.length > 0 && typeof data.Image !== 'string') {

            formData.append("Image", data.Image[0])
        } else {

            formData.append("Image", data.Image)
        }


        try {
            if (isEditMode) {
                formData.append("Id", initialData.id)
                const result = await updateNewsCategory(formData)
                if (result) {
                    toast.success("دسته‌بندی با موفقیت ویرایش شد!")
                    refetch()
                    toggle()
                }
            } else {
                const result = await createNewsCategory(formData)
                if (result) {
                    toast.success("دسته‌بندی جدید با موفقیت ایجاد شد!")
                    refetch()
                    toggle()
                }
            }
        } catch (error) {
            toast.error("خطا در ارتباط با سرور!")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} style={{ fontFamily: 'iranYekan, IRANYekanXFaNum' }} className='modal-dialog-centered'>
            <ModalHeader toggle={toggle}>
                {isEditMode ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm='12' className='mb-1'>
                        <Label for='CategoryName'>نام دسته‌بندی <span className='text-danger'>*</span></Label>
                        <Controller
                            name='CategoryName'
                            control={control}
                            rules={{ required: 'وارد کردن نام دسته‌بندی الزامی است' }}
                            render={({ field }) => (
                                <Input id='CategoryName' invalid={!!errors.CategoryName} {...field} placeholder='برای مثال: تکنولوژی...' />
                            )}
                        />
                        {errors.CategoryName && <FormFeedback className='d-block'>{errors.CategoryName.message}</FormFeedback>}
                    </Col>

                    <Col sm='12' className='mb-1'>
                        <Label for='GoogleTitle'>عنوان سئو (Google Title) <span className='text-danger'>*</span></Label>
                        <Controller
                            name='GoogleTitle'
                            control={control}
                            rules={{ required: 'عنوان سئو الزامی است' }}
                            render={({ field }) => (
                                <Input id='GoogleTitle' invalid={!!errors.GoogleTitle} {...field} placeholder='عنوان برای نمایش در گوگل' />
                            )}
                        />
                        {errors.GoogleTitle && <FormFeedback className='d-block'>{errors.GoogleTitle.message}</FormFeedback>}
                    </Col>

                    <Col sm='12' className='mb-1'>
                        <Label for='GoogleDescribe'>توضیحات سئو (Meta Description) <span className='text-danger'>*</span></Label>
                        <Controller
                            name='GoogleDescribe'
                            control={control}
                            rules={{ required: 'توضیحات سئو الزامی است' }}
                            render={({ field }) => (
                                <Input type='textarea' id='GoogleDescribe' rows='3' invalid={!!errors.GoogleDescribe} {...field} placeholder=' توضیح کوتاه برای سئو...' />
                            )}
                        />
                        {errors.GoogleDescribe && <FormFeedback className='d-block'>{errors.GoogleDescribe.message}</FormFeedback>}
                    </Col>
                    <Col sm='12' className='mb-1'>
                        <Label for='Image'>تصویر دسته‌بندی</Label>
                        <Input
                            type='file'
                            id='Image'
                            accept='image/*'
                            {...register('Image')}
                        />
                        <small className='text-muted mt-50 d-block'>
                            انتخاب تصویر برای این دسته‌بندی اختیاری است.
                        </small>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-start'>
                <Button color='primary' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                    {isSubmitting ? <Spinner size='sm' /> : (isEditMode ? 'ثبت تغییرات' : 'ایجاد دسته‌بندی')}
                </Button>
                <Button color='secondary' outline onClick={toggle} disabled={isSubmitting}>
                    انصراف
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default CategoryModal