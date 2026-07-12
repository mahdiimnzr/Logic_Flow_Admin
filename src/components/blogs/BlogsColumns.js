import React, { useState } from 'react';
import { Badge, Spinner, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Eye, Edit, MoreVertical, Power } from 'react-feather';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { toggleBlogStatus } from "../../core/services/api/blogs/blogs.service";

const baseURL = import.meta.env.VITE_BASE_URL || "";
import defaultIMG from "../../assets/images/coursePng.png"

const ActionsCell = ({ row }) => {

    const initStatus = row.isActive === true || row.active === true;
    const [isActive, setIsActive] = useState(initStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleStatus = async () => {
        const newsStatus = !isActive;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("Active", newsStatus);
        formData.append("Id", row.id);

        try {
            const result = await toggleBlogStatus(formData);
            if (result) {
                setIsActive(newsStatus);
                row.active = newsStatus;
                row.isActive = newsStatus;
                toast.success(`مقاله با موفقیت ${newsStatus ? 'فعال' : 'غیرفعال'} شد!`);
            } else {
                toast.error("خطا در بروزرسانی وضعیت");
            }
        } catch (error) {
            toast.error("مشکلی در برقراری ارتباط با سرور پیش آمد!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <Link to={`/blogs/view/${row.id}`} className="text-body me-1" title="مشاهده جزئیات">
                <Eye size={18} />
            </Link>

            <Link to={`/blogs/edit/${row.id}`} className="text-body me-1" title="ویرایش مقاله">
                <Edit size={18} />
            </Link>

            <UncontrolledDropdown>
                <DropdownToggle className="icon-btn hide-arrow cursor-pointer text-body p-0" tag="span" color="transparent">
                    {isLoading ? <Spinner size="sm" /> : <MoreVertical size={18} />}
                </DropdownToggle>

                <DropdownMenu end>
                    <DropdownItem onClick={handleToggleStatus} className="w-100 d-flex align-items-center">
                        <Power size={14} className="me-50" />
                        <span className="align-middle">{isActive ? 'غیرفعال کردن' : 'فعال کردن'}</span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    );
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
        minWidth: "100px",
        selector: row => row.active,
        cell: row => {
            const isActive = row.isActive === true || row.active === true;
            return (
                <Badge color={isActive ? 'light-success' : 'light-primary'} pill className="px-1 py-50">
                    {isActive ? 'فعال' : 'غیرفعال'}
                </Badge>
            );
        }
    },
    {
        name: "عملیات",
        minWidth: "150px",

        cell: row => <ActionsCell row={row} />
    },
]

export default BlogsColumns;