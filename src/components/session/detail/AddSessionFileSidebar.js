import React, { useEffect, useState } from 'react'
import { Button, Label, Input, FormFeedback, Form, Spinner } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Sidebar from "@components/sidebar"
import ImageDropZone from "../../common/ImageDropZone" 

const AddSessionFileSidebar = ({ isOpen, toggle, sessionId, refetch }) => {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { control, handleSubmit, reset, setValue, register, formState: { errors } } = useForm({
        defaultValues: {
            fileTitle: "",
            sessionFile: null
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                fileTitle: "",
                sessionFile: null
            })
        }
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        setIsSubmitting(true)

        try {
            console.log("File Data to send:", { sessionId, ...data })
            
            setTimeout(() => {
                toast.success("فایل با موفقیت آپلود شد!")
                if(refetch) refetch()
                toggle()
                setIsSubmitting(false)
            }, 1000)

        } catch (error) {
            toast.error("خطا در آپلود فایل!")
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
            title='افزودن فایل جدید به جلسه'
            headerClassName='mb-1 flex justify-between'
            contentClassName='pt-0'
            toggleSidebar={toggle}
            onClosed={handleSidebarClosed}
            style={{ fontFamily: 'iranYekan, IRANYekanXFaNum' }}
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                
                <div className='mb-1'>
                    <Label for='fileTitle'>عنوان فایل <span className='text-danger'>*</span></Label>
                    <Controller
                        name='fileTitle'
                        control={control}
                        rules={{ required: 'وارد کردن عنوان فایل الزامی است' }}
                        render={({ field }) => (
                            <>
                                <Input id='fileTitle' invalid={!!errors.fileTitle} {...field} placeholder='برای مثال: اسلایدهای جلسه دوم' />
                                {errors.fileTitle && <FormFeedback className='d-block'>{errors.fileTitle.message}</FormFeedback>}
                            </>
                        )}
                    />
                </div>

                <div className='mb-2'>
                    <Label className='mb-50'>انتخاب فایل <span className='text-danger'>*</span></Label>
                    <input 
                        type="hidden" 
                        {...register("sessionFile", { required: 'آپلود فایل برای این بخش الزامی است' })} 
                    />
                    <ImageDropZone
                        error={errors.sessionFile ? errors.sessionFile.message : null}
                        onChange={(files) => {
                            if (files && files.length > 0) {
                                setValue("sessionFile", files[0], { shouldValidate: true });
                            } else {
                                setValue("sessionFile", null, { shouldValidate: true });
                            }
                        }}
                    />

                    {errors.sessionFile && (
                        <FormFeedback className='d-block mt-50'>{errors.sessionFile.message}</FormFeedback>
                    )}
                </div>

                <div className="d-flex justify-content-start mt-2">
                    <Button type='submit' color='primary' className='me-1' disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size='sm' /> : 'آپلود فایل'}
                    </Button>
                    <Button type='button' color='secondary' outline onClick={toggle} disabled={isSubmitting}>
                        انصراف
                    </Button>
                </div>
            </Form>
        </Sidebar>
    )
}

export default AddSessionFileSidebar