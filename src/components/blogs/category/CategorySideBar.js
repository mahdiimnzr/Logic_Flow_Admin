import React, { useEffect, useState } from 'react'
import { Button, Label, Input, FormFeedback, Form, Spinner } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import Sidebar from "@components/sidebar"

import ImageDropZone from "../../common/ImageDropZone" 

import { createNewsCategory, updateNewsCategory } from '../../../core/services/api/blogs/blogs.service'

const CategorySidebar = ({ isOpen, toggle, initialData, refetch }) => {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditMode = !!initialData

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            CategoryName: "",
            GoogleTitle: "",
            GoogleDescribe: "",
            IconName: "default-icon",
            IconAddress: "default-address",
            Image: null
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
                    Image: initialData.image || null
                })
            } else {
                reset({
                    CategoryName: "",
                    GoogleTitle: "",
                    GoogleDescribe: "",
                    IconName: "icon",
                    IconAddress: "address",
                    Image: null
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

        if (data.Image && typeof data.Image !== 'string') {
            formData.append("Image", data.Image)
        } else if (data.Image) {
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

    const handleSidebarClosed = () => {
        reset()
    }

    return (
        <Sidebar
            size='lg'
            open={isOpen}
            title={isEditMode ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
            headerClassName='mb-1 flex justify-between'
            contentClassName='pt-0'
            toggleSidebar={toggle}
            onClosed={handleSidebarClosed}
            style={{ fontFamily: 'iranYekan, IRANYekanXFaNum' }}
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                
                <div className='mb-1'>
                    <Label for='CategoryName'>نام دسته‌بندی <span className='text-danger'>*</span></Label>
                    <Controller
                        name='CategoryName'
                        control={control}
                        rules={{ required: 'وارد کردن نام دسته‌بندی الزامی است' }}
                        render={({ field }) => (
                            <>
                                <Input id='CategoryName' invalid={!!errors.CategoryName} {...field} placeholder='برای مثال: تکنولوژی...' />
                                {errors.CategoryName && <FormFeedback className='d-block'>{errors.CategoryName.message}</FormFeedback>}
                            </>
                        )}
                    />
                </div>

                <div className='mb-1'>
                    <Label for='GoogleTitle'>عنوان سئو (Google Title) <span className='text-danger'>*</span></Label>
                    <Controller
                        name='GoogleTitle'
                        control={control}
                        rules={{ required: 'عنوان سئو الزامی است' }}
                        render={({ field }) => (
                            <>
                                <Input id='GoogleTitle' invalid={!!errors.GoogleTitle} {...field} placeholder='عنوان برای نمایش در گوگل' />
                                {errors.GoogleTitle && <FormFeedback className='d-block'>{errors.GoogleTitle.message}</FormFeedback>}
                            </>
                        )}
                    />
                </div>

                <div className='mb-1'>
                    <Label for='GoogleDescribe'>توضیحات سئو (Meta Description) <span className='text-danger'>*</span></Label>
                    <Controller
                        name='GoogleDescribe'
                        control={control}
                        rules={{ required: 'توضیحات سئو الزامی است' }}
                        render={({ field }) => (
                            <>
                                <Input type='textarea' id='GoogleDescribe' rows='3' invalid={!!errors.GoogleDescribe} {...field} placeholder='توضیح کوتاه برای سئو...' />
                                {errors.GoogleDescribe && <FormFeedback className='d-block'>{errors.GoogleDescribe.message}</FormFeedback>}
                            </>
                        )}
                    />
                </div>

                <div className='mb-1'>
                    <ImageDropZone
                        error={errors.Image ? errors.Image.message : null}
                        onChange={(files) => {
                            if (files && files.length > 0) {
                                setValue("Image", files[0], { shouldValidate: true });
                            } else {
                                setValue("Image", null, { shouldValidate: true });
                            }
                        }}
                    />
                    <small className='text-muted mt-50 d-block'>
                        انتخاب تصویر برای این دسته‌بندی اختیاری است.
                    </small>
                </div>

                <div className="d-flex justify-content-start mt-2">
                    <Button type='submit' color='primary' className='me-1' disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size='sm' /> : (isEditMode ? 'ثبت تغییرات' : 'ایجاد دسته‌بندی')}
                    </Button>
                    <Button type='button' color='secondary' outline onClick={toggle} disabled={isSubmitting}>
                        انصراف
                    </Button>
                </div>

            </Form>
        </Sidebar>
    )
}

export default CategorySidebar