import React from 'react'
import { Edit } from 'react-feather'

export const getCategoryColumns = (onEditClick) => [
    {
        name: "نام دسته‌بندی",
        sortable: true,
        minWidth: "250px",
        selector: row => row.categoryName,
        cell: row => <span className="fw-bolder text-primary">{row.categoryName}</span>
    },
    {
        name: "عنوان گوگل (SEO)",
        sortable: true,
        minWidth: "300px",
        selector: row => row.googleTitle,
        cell: row => <span>{row.googleTitle || "-"}</span>
    },
    {
        name: "عملیات",
        minWidth: "100px",
        cell: row => (
            <div className="d-flex">
                <span
                    className="cursor-pointer text-primary me-1"
                    onClick={() => onEditClick(row)}
                >
                    ویرایش
                </span>
            </div>
        )
    }
]