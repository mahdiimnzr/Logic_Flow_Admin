import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, FormFeedback, Button, Spinner } from 'reactstrap'
import Select from 'react-select'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Controller } from 'react-hook-form'
import { getNewsCategories } from '../../../core/services/api/blogs/blogs.service'

const BasicInfo = ({ stepper, control, errors, trigger }) => {

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

    const handleNext = async () => {
        const isStepValid = await trigger([
            'title',
            'categoryId',
            'googleTitle',
            'keyword',
            'miniDescribe',
            'googleDescribe'
        ]);

        if (isStepValid) {
            stepper.next();
        }
    };


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
                        rules={{
                            required: 'عنوان مقاله الزامی است',
                            minLength: { value: 5, message: 'عنوان باید حداقل ۵ کاراکتر باشد' },
                        }}
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
                        render={({ field: { onChange, value } }) => {
                            const categoryOptions = categories?.map(ca => ({
                                value: ca.id,
                                label: ca.categoryName
                            })) || []
                            const selectedOption = categoryOptions.find(c => c.value === value) || null
                            return (
                                <Select
                                    isClearable={false}
                                    classNamePrefix='select'
                                    className={`react-select ${errors.categoryId ? 'is-invalid' : ''}`}
                                    options={categoryOptions}
                                    value={selectedOption}
                                    placeholder={isLoading ? "در حال دریافت..." : "دسته‌بندی را انتخاب کنید"}
                                    isDisabled={isLoading}
                                    onChange={(data) => {
                                        onChange(data ? data.value : '')
                                    }}
                                />
                            )
                        }}
                    />
                    {errors.categoryId && <FormFeedback className='d-block'>{errors.categoryId.message}</FormFeedback>}
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='googleTitle'>عنوان گوگل (SEO)</Label>
                    <Controller
                        id='googleTitle'
                        name='googleTitle'
                        control={control}
                        rules={{ required: 'عنوان گوگل الزامی است' }}
                        render={({ field }) => (
                            <Input {...field} placeholder='عنوانی که در نتایج گوگل نمایش داده می‌شود' />
                        )}
                    />
                    {errors.googleTitle && <FormFeedback className='d-block'>{errors.googleTitle.message}</FormFeedback>}
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='keyword'>کلمات کلیدی</Label>
                    <Controller
                        id='keyword'
                        name='keyword'
                        control={control}
                        rules={{ required: 'وارد کردن حداقل یک کلمه کلیدی الزامی است' }}
                        render={({ field }) => (
                            <Input {...field} placeholder='با کاما جدا کنید (برای مثال: ریکت, برنامه نویسی)' />
                        )}
                    />
                    {errors.keyword && <FormFeedback className='d-block'>{errors.keyword.message}</FormFeedback>}
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='miniDescribe'>توضیح کوتاه </Label>
                    <Controller
                        id='miniDescribe'
                        name='miniDescribe'
                        control={control}
                        rules={{
                            required: 'چکیده مقاله الزامی است',
                            minLength: { value: 20, message: 'چکیده باید حداقل ۲۰ کاراکتر باشد' }
                        }}
                        render={({ field }) => (
                            <Input type='textarea' rows='3' {...field} placeholder='یک توضیح کوتاه برای نمایش در کارت مقاله...' />
                        )}
                    />
                    {errors.miniDescribe && <FormFeedback className='d-block'>{errors.miniDescribe.message}</FormFeedback>}
                </Col>

                <Col md='6' className='mb-1'>
                    <Label className='form-label' for='googleDescribe'>توضیحات گوگل </Label>
                    <Controller
                        id='googleDescribe'
                        name='googleDescribe'
                        control={control}
                        rules={{ required: 'توضیحات گوگل الزامی است' }}
                        render={({ field }) => (
                            <Input type='textarea' rows='3' {...field} placeholder='توضیحات متنی برای سئو و نمایش در گوگل...' />
                        )}
                    />
                    {errors.googleDescribe && <FormFeedback className='d-block'>{errors.googleDescribe.message}</FormFeedback>}
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
                <Button color='primary' className='btn-next' onClick={handleNext}>
                    <span className='align-middle d-sm-inline-block d-none'>بعدی</span>
                    <ArrowRight size={14} className='align-middle ms-sm-25 ms-0' />
                </Button>
            </div>
        </Fragment>
    )
}

export default BasicInfo