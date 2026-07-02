import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FileText, Image, Type, Eye } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import Wizard from "../components/blogs/wizard/index"
import BasicInfo from '../components/blogs/add/BasicInfo';
import BlogContent from '../components/blogs/add/BlogContent';
import BlogCover from '../components/blogs/add/BlogCover';
import BlogPreview from '../components/blogs/add/BlogPreview';
import { createNewsBlog, getNewsById, updateNews, updateNewsFile } from '../core/services/api/blogs/blogs.service';

const BlogAdd = () => {

  const ref = useRef(null)

  const [stepper, setStepper] = useState(null)

  const navigate = useNavigate()

  const [originalData, setOriginalData] = useState(null)

  const {id} = useParams()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    watch,
    reset,
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

  useEffect(() => {
    if (id) {
      const fetchArticleData = async () => {
        try {

          const data = await getNewsById(id);

          if (data && data.detailsNewsDto) {

            const news = data.detailsNewsDto;
            setOriginalData(news);

            reset({
              title: news.title,
              googleTitle: news.googleTitle,
              googleDescribe: news.googleDescribe,
              miniDescribe: news.miniDescribe,
              describe: news.describe,
              keyword: news.keyword,
              isActive: news.active,
              isSlider: news.isSlider,
              categoryId: news.newsCatregoryId,
              image: news.currentImageAddress
            });
          }
        } catch (error) {
          toast.error("خطا در دریافت اطلاعات مقاله!");
        }
      };
      fetchArticleData();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {

    if (id) {
      const updateFormData = new FormData();

      updateFormData.append("Id", id);
      updateFormData.append("Title", data.title);
      updateFormData.append("GoogleTitle", data.googleTitle);
      updateFormData.append("GoogleDescribe", data.googleDescribe);
      updateFormData.append("MiniDescribe", data.miniDescribe);
      updateFormData.append("Describe", data.describe);
      updateFormData.append("Keyword", data.keyword);
      updateFormData.append("IsSlider", data.isSlider);
      updateFormData.append("Active", data.isActive);
      updateFormData.append("NewsCatregoryId", data.categoryId);
      updateFormData.append("CurrentImageAddress", originalData.currentImageAddress || "");
      updateFormData.append("CurrentImageAddressTumb", originalData.currentImageAddressTumb || "");
      updateFormData.append("SlideNumber", 1);

      try {

        const textUpdateResult = await updateNews(updateFormData);

        if (data.image && typeof data.image !== 'string') {
          const fileFormData = new FormData();
          fileFormData.append("NewsId", id);
          fileFormData.append("IsSlide", data.isSlider);
          fileFormData.append("SelectForMainImage", true);
          fileFormData.append("File", data.image);

          await updateNewsFile(fileFormData);
        }

        if (textUpdateResult) {
          toast.success("مقاله با موفقیت ویرایش شد!");
          navigate('/blogs/list');
        }
      } catch (error) {
        toast.error("خطا در ویرایش مقاله!");
        console.error(error);
      }
    } else {
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

          toast.success("مقاله با موفقیت ایجاد شد!");
          navigate("/blogs/list")

        } else {

          toast.error("خطا در ساخت مقاله! لطفا دوباره تلاش کنید!")
          console.error("Error creating News!", result);

        }
      } catch (error) {

        toast.error("مشکلی در ارتباط با سرور پیش آمد!")
        console.error("Error API!", error);

      }
    }
  }

  const steps = [
    {
      id: "basic-info",
      title: "اطلاعات پایه",
      subtitle: "عنوان و دسته بندی مقاله",
      icon: <Type size={18} />,
      content: <BasicInfo stepper={stepper} control={control} errors={errors} trigger={trigger} register={register} />,
    },
    {
      id: "blog-content",
      title: "محتوای مقاله",
      subtitle: "متن اصلی مقاله",
      icon: <FileText size={18} />,
      content: <BlogContent stepper={stepper} errors={errors} trigger={trigger} control={control} />,
    },
    {
      id: "blog-cover",
      title: "کاور مقاله",
      subtitle: "آپلود عکس مقاله",
      icon: <Image size={18} />,
      content: <BlogCover stepper={stepper} control={control} trigger={trigger} setValue={setValue} />,
    },
    {
      id: "blog-preview",
      title: " پیش نمایش",
      subtitle: " تایید نهایی اطلاعات",
      icon: <Eye size={18} />,
      content: <BlogPreview stepper={stepper} watch={watch} onSubmit={handleSubmit(onSubmit)} isEditMode={!!id} />,

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