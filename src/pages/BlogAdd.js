import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FileText, Image, Type } from 'react-feather'
import Wizard from "../components/blogs/wizard/index"
import BasicInfo from '../components/blogs/add/BasicInfo';
import BlogContent from '../components/blogs/add/BlogContent';
import BlogCover from '../components/blogs/add/BlogCover';
import { createNewsBlog } from '../core/services/api/blogs/blogs.service';

const BlogAdd = () => {

  const ref = useRef(null)

  const [stepper, setStepper] = useState(null)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      title: "",
      googleTitle: "",
      googleDescribe: "",
      miniDescribe: "",
      describe: "",
      keyword: "",
      isActive: true,
      isSlider: false,
      categoryId: "",
      image: null,
    }
  })

  const onSubmit = async (data) => {
    console.log("Data :", data);
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("GoogleTitle", data.googleTitle);
    formData.append("GoogleDescribe", data.googleDescribe);
    formData.append("MiniDescribe", data.miniDescribe);
    formData.append("Describe", data.describe);
    formData.append("Keyword", data.keyword);
    formData.append("IsSlider", data.isSlider);
    formData.append("NewsCatregoryId", data.categoryId);
    if (data.image) {
      formData.append("Image", data.image);
    } else {
      console.warn("No Image");
    }
    try {
      const result = await createNewsBlog(formData);
      if (result && result.success) {
        console.log("News Created successfully!", result);
      } else { console.error("Error creating News!", result); }
    } catch (error) {
      console.error("Error API!", error);
    }
  }

  const steps = [
    {
      id: "basic-info",
      title: "اطلاعات پایه",
      subtitle: "عنوان و دسته بندی مقاله",
      icon: <Type size={18} />,
      content: <BasicInfo stepper={stepper} control={control} errors={errors} register={register} />,
    },
    {
      id: "blog-content",
      title: "محتوای مقاله",
      subtitle: "متن اصلی مقاله",
      icon: <FileText size={18} />,
      content: <BlogContent stepper={stepper} errors={errors} setValue={setValue} register={register} />,
    },
    {
      id: "blog-cover",
      title: "کاور مقاله",
      subtitle: "آپلود عکس مقاله",
      icon: <Image size={18} />,
      content: <BlogCover stepper={stepper} control={control} setValue={setValue} onSubmit={handleSubmit(onSubmit)} />,
    }
  ]

  return (
    <div className='modern-vertical-wizard'>
      <Wizard
        type="modern-vertical"
        ref={ref}
        steps={steps}
        options={{ linear: false }}
        instance={e => setStepper(e)}
      />
    </div>
  )
}

export default BlogAdd