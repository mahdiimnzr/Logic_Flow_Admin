import { React, useEffect, useState } from 'react'
import { Card, CardBody, Badge, Button, Spinner } from 'reactstrap'
import { Calendar, User, Edit, Power } from 'react-feather'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { toggleBlogStatus } from '../../../core/services/api/blogs/blogs.service'

import defaultIMG from "../../../assets/images/coursePng.png"

const baseURL = import.meta.env.VITE_BASE_URL || "";

const BlogInfoCard = ({ article }) => {

    const [isActive, setIsActive] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        if (article) {
            setIsActive(article.active);
        }
    }, [article]);

    const handleToggleStatus = async () => {
        if (!article?.id) return;

        const newStatus = !isActive;
        setIsActive(newStatus);
        setIsToggling(true);

        const formData = new FormData();
        formData.append("Active", newStatus);
        formData.append("Id", article.id);

        try {

            const result = await toggleBlogStatus(formData);
            if (result) {
                toast.success(`مقاله با موفقیت ${newStatus ? 'فعال' : 'غیرفعال'} شد!`);
            } else {
                setIsActive(!newStatus);
                toast.error("خطا در بروزرسانی وضعیت");
            }

        } catch (error) {
            setIsActive(!newStatus);
            toast.error("مشکلی در برقراری ارتباط با سرور پیش آمد!");
        } finally {
            setIsToggling(false);
        }
    };


    let coverImage = defaultIMG;

    if (article?.currentImageAddress && article.currentImageAddress !== "null" && article.currentImageAddress !== "") {

        coverImage = article.currentImageAddress.startsWith('http')
            ? article.currentImageAddress
            : `${baseURL}/${article.currentImageAddress}`;
    } else if (article?.currentImageAddressTumb && article.currentImageAddressTumb !== "null" && article.currentImageAddressTumb !== "") {

        coverImage = article.currentImageAddressTumb.startsWith('http')
            ? article.currentImageAddressTumb
            : `${baseURL}/${article.currentImageAddressTumb}`;
    }

    return (
        <Card className='h-100'>
            <CardBody>

                <div className="d-flex flex-column align-items-center text-center">
                    <img
                        src={coverImage}
                        alt={article?.title || 'عنوان مقاله'}
                        className="img-fluid rounded mb-2 shadow-sm"
                        style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultIMG;
                        }}
                    />
                    <h4 className="fw-bolder mb-1">{article?.title}</h4>
                    <Badge color={isActive ? 'light-success' : 'light-danger'} className="mb-2">
                        {isActive ? ' فعال' : ' غیرفعال'}
                    </Badge>
                </div>

                <div className="d-flex justify-content-around my-2 pt-75">
                    <div className="d-flex align-items-start me-2">
                        <Badge color="light-primary" className="rounded p-75 me-1">
                            <Calendar className="font-medium-2" />
                        </Badge>
                        <div>
                            <h5 className="mb-0">تاریخ ثبت</h5>
                            <small>{article?.insertDate ? new Date(article.insertDate).toLocaleDateString('fa-IR') : '-'}</small>
                        </div>
                    </div>

                    <div className="d-flex align-items-start">
                        <Badge color="light-success" className="rounded p-75 me-1">
                            <User className="font-medium-2" />
                        </Badge>
                        <div>
                            <h5 className="mb-0">آیدی نویسنده</h5>
                            <small className='d-block text-center'>{article?.userId || '-'}</small>
                        </div>
                    </div>
                </div>

                <h4 className="fw-bolder border-bottom pb-50 mb-1 mt-2">جزئیات مقاله</h4>
                <div className="info-container">
                    <ul className="list-unstyled">
                        <li className="mb-75">
                            <span className="fw-bolder me-25">دسته بندی:</span>
                            <span>{article?.newsCatregoryId || '-'}</span>
                        </li>
                        <li className="mb-75">
                            <span className="fw-bolder me-25">عنوان سئو:</span>
                            <span>{article?.googleTitle || '-'}</span>
                        </li>
                        <li className="mb-75">
                            <span className="fw-bolder me-25">کلمات کلیدی:</span>
                            <span className='text-wrap'>{article?.keyword || '-'}</span>
                        </li>
                    </ul>
                </div>

                <div className="d-flex flex-column gap-2 mt-2">
                    <Link to={`/blogs/edit/${article?.id}`}>
                        <Button color="primary" className="w-100">
                            <Edit size={14} className="me-50" />
                            ویرایش
                        </Button>
                    </Link>

                    <Button
                        color={isActive ? "outline-danger" : "outline-success"}
                        className="w-100"
                        onClick={handleToggleStatus}
                        disabled={isToggling}
                    >
                        {isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                    </Button>
                </div>
            </CardBody>
        </Card>
    )
}

export default BlogInfoCard