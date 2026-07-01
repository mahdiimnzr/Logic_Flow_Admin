import { Fragment, useState, useEffect } from 'react'
import { Label, Button } from 'reactstrap'
import { ArrowLeft, ArrowRight } from 'react-feather'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const BlogContent = ({ stepper, errors, setValue, register }) => {
  const [editorValue, setEditorValue] = useState('')

  useEffect(() => {
    register('describe', { required: 'وارد کردن متن مقاله الزامی است' })
  }, [register])

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorValue(content)

    const text = editor.getText().trim()
    const finalValue = text.length === 0 ? '' : content
    
    setValue('describe', finalValue, { shouldValidate: true })
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>محتوای مقاله</h5>
        <small className='text-muted'>متن اصلی مقاله را اینجا بنویسید.</small>
      </div>

      <div className='mb-1'>
        <Label className='form-label' for='describe'>
          بدنه مقاله <span className='text-danger'>*</span>
        </Label>

        <div className={errors.describe ? 'border border-danger rounded' : ''}>
          <ReactQuill 
            theme="snow" 
            value={editorValue} 
            onChange={handleEditorChange}
            style={{ minHeight: '250px', direction: 'rtl' }}
          />
        </div>

        {errors.describe && <span className='text-danger fs-6 mt-1 d-block'>{errors.describe.message}</span>}
      </div>

      <div className='d-flex justify-content-between mt-2'>
        <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
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

export default BlogContent