import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, FormFeedback, Button, Spinner } from 'reactstrap'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Controller } from 'react-hook-form'
import { getNewsCategories } from '../../../core/services/api/blogs/blogs.service'

const BasicInfo = ({ stepper, control, errors }) => {

    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true)
            const data = await getNewsCategories()
            if (data) {
                setCategories(data)
            }
            setIsLoading(false)
        }
        fetchCategories()
    }, [])

    return (
        <Fragment>
            <div className='content-header mb-2'>
                <h5 className='mb-0'>اطلاعات پایه و سئو</h5>
                <small className='text-muted'>عنوان، دسته‌بندی و اطلاعات مربوط به موتورهای جستجو را وارد کنید</small>
            </div>
            <Row>
                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='title'>
                        عنوان مقاله <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        id='title'
                        name='title'
                        control={control}
                        rules={{ required: 'عنوان مقاله الزامی است' }}
                        render={({ field }) => (
                            <Input invalid={errors.title && true} {...field} placeholder='برای مثال: معرفی ری‌اکت ' />
                        )}
                    />
                    {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='categoryId'>
                        دسته‌بندی <span className='text-danger'>*</span>
                        {isLoading && <Spinner size="sm" className='ms-1 text-primary' />}
                    </Label>
                    <Controller
                        id='categoryId'
                        name='categoryId'
                        control={control}
                        rules={{ required: 'انتخاب دسته‌بندی الزامی است' }}
                        render={({ field }) => (
                            <Input type='select' invalid={errors.categoryId && true} disabled={isLoading} {...field}>
                                <option value=''> {isLoading ? "در حال دریافت دسته بندی ها" : "انتخاب کنید"} </option>
                                {categories?.map(ca => (
                                    <option key={ca.id} value={ca.id}> {ca.categoryName} </option>
                                ))}
                            </Input>
                        )}
                    />
                    {errors.categoryId && <FormFeedback>{errors.categoryId.message}</FormFeedback>}
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='googleTitle'>عنوان گوگل (SEO)</Label>
                    <Controller
                        id='googleTitle'
                        name='googleTitle'
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder='عنوانی که در نتایج گوگل نمایش داده می‌شود' />
                        )}
                    />
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='keyword'>کلمات کلیدی</Label>
                    <Controller
                        id='keyword'
                        name='keyword'
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder='با کاما جدا کنید (برای مثال: ریکت, برنامه نویسی)' />
                        )}
                    />
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='miniDescribe'>توضیح کوتاه </Label>
                    <Controller
                        id='miniDescribe'
                        name='miniDescribe'
                        control={control}
                        render={({ field }) => (
                            <Input type='textarea' rows='3' {...field} placeholder='یک توضیح کوتاه برای نمایش در کارت مقاله...' />
                        )}
                    />
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='googleDescribe'>توضیحات گوگل </Label>
                    <Controller
                        id='googleDescribe'
                        name='googleDescribe'
                        control={control}
                        render={({ field }) => (
                            <Input type='textarea' rows='3' {...field} placeholder='توضیحات متنی برای سئو و نمایش در گوگل...' />
                        )}
                    />
                </Col>

                <Col md='6' className='mb-1 mt-1'>
                    <div className='form-check form-switch'>
                        <Controller
                            id='isSlider'
                            name='isSlider'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Input type='switch' id='isSlider' checked={value} onChange={onChange} />
                            )}
                        />
                        <Label className='form-check-label' for='isSlider'>
                            نمایش در اسلایدر اصلی سایت
                        </Label>
                    </div>
                </Col>
            </Row>

            <div className='d-flex justify-content-between mt-2'>
                <Button color='secondary' className='btn-prev' outline disabled>
                    <ArrowLeft size={14} className='align-middle me-sm-25 me-0' />
                    <span className='align-middle d-sm-inline-block d-none'>قبلی</span>
                </Button>
                <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
                    <span className='align-middle d-sm-inline-block d-none'>بعدی</span>
                    <ArrowRight size={14} className='align-middle ms-sm-25 ms-0' />
                </Button>
            </div>
        </Fragment>
    )
}

export default BasicInfo