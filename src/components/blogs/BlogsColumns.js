import { Badge } from "reactstrap";
import React from 'react'
import { classNames } from 'classnames';

const baseURL = import.meta.env.VITE_BASE_URL || "";
import defaultIMG from "../../assets/images/coursePng.png"

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
                <div className='d-flex align-items-center'>
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
                        <span className='fw-bolder'>{row.title}</span>
                        <small className='text-truncate text-muted mb-0' style={{ maxWidth: '200px' }}>
                            {row.miniDescribe || 'بدون توضیحات'}
                        </small>
                    </div>
                </div>
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
        selector: row => row.isActive,
        cell: row => {
            const isItemActive = row.isActive === true || row.active === true;
            return (
                <Badge color={isItemActive ? "light-success" : "light-danger"} pill>
                    {isItemActive ? "فعال" : "غیرفعال"}
                </Badge>
            )
        }
    },
    {
        name: "عملیات",
        minWidth: "100px",
        cell: row => (
            <div className="d-flex">
                <span className="cursor-pointer text-primary me-1">ویرایش</span>
            </div>
        )
    },
]

export default BlogsColumns