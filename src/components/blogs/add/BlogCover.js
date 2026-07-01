import { Fragment, useState } from 'react'
import { Button, ListGroup, ListGroupItem } from 'reactstrap'
import { ArrowLeft, ArrowRight, X, DownloadCloud } from 'react-feather'
import { useDropzone } from 'react-dropzone'
import { Controller } from 'react-hook-form'

const BlogCover = ({ stepper, control, setValue, trigger }) => {
	const [preview, setPreview] = useState(null)

	const { getRootProps, getInputProps } = useDropzone({
		multiple: false,
		accept: { 'image/*': [] },
		onDrop: acceptedFiles => {
			const file = acceptedFiles[0]
			if (file) {
				setValue('image', file, { shouldValidate: true })
				setPreview(URL.createObjectURL(file))
			}
		}
	})

	const handleRemoveFile = () => {
		setValue('image', null, { shouldValidate: true })
		setPreview(null)
	}

	const handleNext = async () => {
		const isStepValid = await trigger(['image'])
		if (isStepValid) stepper.next()
	}

	return (
		<Fragment>
			<div className='content-header'>
				<h5 className='mb-0'>کاور مقاله</h5>
				<small className='text-muted'> یک عکس انتخاب کنید. </small>
			</div>

			<div className='mb-1'>
				<Controller
					name='image'
					control={control}
					rules={{ required: 'آپلود عکس کاور الزامی است' }}
					render={({ field, fieldState: { error } }) => (
						<Fragment>
							<div {...getRootProps({ className: `dropzone ${error ? 'border-danger border rounded' : ''}` })}>
								<input {...getInputProps()} />
								<div className='d-flex align-items-center justify-content-center flex-column' style={{ padding: '2rem', border: '2px dashed #ebe9f1' }}>
									<DownloadCloud size={64} className='mb-1' />
									<h5>فایل را اینجا رها کنید یا برای آپلود کلیک کنید</h5>
									<p className='text-secondary'>فقط فایل‌های تصویری مجاز هستند</p>
								</div>
							</div>
							{error && <div className='text-danger mt-50'>{error.message}</div>}
						</Fragment>
					)}
				/>
				{preview && (
					<ListGroup className='my-2'>
						<ListGroupItem className='d-flex align-items-center justify-content-between'>
							<div className='file-details d-flex align-items-center'>
								<div className='file-preview me-1'>
									<img className='rounded' alt='preview' src={preview} height='38' width='38' style={{ objectFit: 'cover' }} />
								</div>
								<div>
									<p className='file-name mb-0 text-success'>کاور با موفقیت انتخاب شد</p>
								</div>
							</div>
							<Button color='danger' outline size='sm' className='btn-icon' onClick={handleRemoveFile}>
								<X size={14} />
							</Button>
						</ListGroupItem>
					</ListGroup>
				)}
			</div>

			<div className='d-flex justify-content-between mt-2'>
				<Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
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

export default BlogCover