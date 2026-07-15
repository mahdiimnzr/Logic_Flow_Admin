import React, { useEffect, useState } from 'react'
import { Button, Label, Input, FormFeedback, Form, Spinner } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Sidebar from "@components/sidebar" 

const AddHomeworkSidebar = ({ isOpen, toggle, sessionId, refetch }) => {

    const [isSubmitting, setIsSubmitting] = useState(false) 

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            hwTitle: "",
            hwDescribe: ""
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                hwTitle: "",
                hwDescribe: ""
            })
        }
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        setIsSubmitting(true) 

        try {
            console.log("Data to send:", { sessionId, ...data })
            
            setTimeout(() => {
                toast.success("تکلیف با موفقیت ایجاد شد!") 
                if(refetch) refetch() 
                toggle() 
                setIsSubmitting(false) 
            }, 1000)

        } catch (error) {
            toast.error("خطا در ارتباط با سرور!") 
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
            title='افزودن تکلیف جدید'
            headerClassName='mb-1 flex justify-between' 
            contentClassName='pt-0' 
            toggleSidebar={toggle} 
            onClosed={handleSidebarClosed} 
            style={{ fontFamily: 'iranYekan, IRANYekanXFaNum' }} 
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                
                <div className='mb-1'>
                    <Label for='hwTitle'>عنوان تکلیف <span className='text-danger'>*</span></Label>
                    <Controller
                        name='hwTitle'
                        control={control} 
                        rules={{ required: 'وارد کردن عنوان تکلیف الزامی است' }} 
                        render={({ field }) => (
                            <>
                                <Input id='hwTitle' invalid={!!errors.hwTitle} {...field} placeholder='برای مثال: تمرین اول...' />
                                {errors.hwTitle && <FormFeedback className='d-block'>{errors.hwTitle.message}</FormFeedback>}
                            </>
                        )}
                    />
                </div>

                <div className='mb-1'>
                    <Label for='hwDescribe'>توضیحات <span className='text-danger'>*</span></Label>
                    <Controller
                        name='hwDescribe'
                        control={control} 
                        rules={{ required: 'وارد کردن توضیحات الزامی است' }} 
                        render={({ field }) => (
                            <>
                                <Input type='textarea' id='hwDescribe' rows='4' invalid={!!errors.hwDescribe} {...field} placeholder='توضیحات تکلیف را اینجا بنویسید...' />
                                {errors.hwDescribe && <FormFeedback className='d-block'>{errors.hwDescribe.message}</FormFeedback>}
                            </>
                        )}
                    />
                </div>

                <div className="d-flex justify-content-start mt-2">
                    <Button type='submit' color='primary' className='me-1' disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size='sm' /> : 'ایجاد تکلیف'}
                    </Button>
                    <Button type='button' color='secondary' outline onClick={toggle} disabled={isSubmitting}>
                        انصراف
                    </Button>
                </div>
            </Form>
        </Sidebar>
    )
}

export default AddHomeworkSidebar