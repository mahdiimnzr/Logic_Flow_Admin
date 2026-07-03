import { Badge, Input, Spinner } from "reactstrap";
import { React, useState } from 'react'
import { classNames } from 'classnames';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { toggleBlogStatus } from "../../core/services/api/blogs/blogs.service";

const baseURL = import.meta.env.VITE_BASE_URL || "";
import defaultIMG from "../../assets/images/coursePng.png"

const StatusToggleCell = ({ row }) => {

    const initStatus = row.isActive === true || row.active === true;
    const [isActive, setIsActive] = useState(initStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (e) => {
        const newsStatus = e.target.checked;
        setIsActive(newsStatus);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("Active", newsStatus);
        formData.append("Id", row.id);

        try {
            const result = await toggleBlogStatus(formData);
            if (result) {
                toast.success("وضعیت مقاله با موفقیت بروز رسانی شد!");
            } else {
                setIsActive(!newsStatus);
                toast.error("خطا در بروزرسانی وضعیت");
            }
        } catch (error) {
            setIsActive(!newsStatus);
            toast.error("مشکلی در برقراری ارتباط با سرور پیش آمد!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <div className="form-check form-switch">
                <Input
                    type="switch"
                    id={`status-switch-${row.id}`}
                    checked={isActive}
                    onChange={handleToggle}
                    disabled={isLoading}
                />
            </div>
            {isLoading && <Spinner size="sm" color="primary" className="ms-50" />}
        </div>
    )

};

const BlogsColumns = [
{
        name: "مقاله",
        sortable: true,
        minWidth: "300px",
        selector: row => row.title,
        cell: row => {
            let imgSrc = defaultIMG;
            if (row.currentImageAddressTumb) {
                imgSrc = row.currentImageAddressTumb.startsWith('http')
                    ? row.currentImageAddressTumb
                    : `${baseURL}/${row.currentImageAddressTumb}`;
            }
            return (
                <Link 
                    to={`/blogs/view/${row.id}`} 
                    className='d-flex align-items-center text-decoration-none text-body'
                >
                    <img
                        src={imgSrc}
                        alt={row.title}
                        width='40'
                        height='40'
                        className='me-1 rounded'
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultIMG
                        }}
                    />
                    <div className='d-flex flex-column'>
                        <span className='fw-bolder cursor-pointer text-primary'>{row.title}</span>
                        <small className='text-truncate text-muted mb-0' style={{ maxWidth: '200px' }}>
                            {row.miniDescribe || 'بدون توضیحات'}
                        </small>
                    </div>
                </Link>
            )
        }
    },
    {
        name: "دسته بندی",
        sortable: true,
        minWidth: "150px",
        selector: row => row.category?.categoryName || row.newsCategoryName,
        cell: row => <span> {row.category?.categoryName || row.newsCategoryName || "بدون دسته بندی"} </span>
    },
    {
        name: "بازدید",
        sortable: true,
        selector: row => row.currentView,
        cell: row => <span className="text-primary fw-bold">{row.currentView}</span>
    },
    {
        name: "وضعیت",
        sortable: true,
        cell: row => <StatusToggleCell row={row} />
    },
    {
        name: "عملیات",
        minWidth: "100px",
        cell: row => {
            return (
                <div className="d-flex align-items-center">
                    <Link to={`/blogs/edit/${row.id}`}
                        className="text-primary me-1 text-decoration-none" >
                        ویرایش
                    </Link>
                </div>
            )
        }
    },
]

export default BlogsColumns