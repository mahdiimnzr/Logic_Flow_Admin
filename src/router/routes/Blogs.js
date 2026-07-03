import { lazy } from "react"

import React from 'react'

const BlogsList = lazy(() => import("../../pages/BlogsList"))
const BlogAdd = lazy(() => import("../../pages/BlogAdd"))
const BlogCategory = lazy(() => import("../../pages/BlogCategory"))
const BlogDetails = lazy(() => import("../../pages/BlogDetails"))


const BlogsRoute = [
    {
        path: "/blogs/list",
        element: <BlogsList />,
    },
    {
        path: "/blogs/add",
        element: <BlogAdd />,
    },
    {
        path: "/blogs/edit/:id",
        element: <BlogAdd />,
    },
    {
        path: "/blogs/categories",
        element: <BlogCategory />,
    },
    {
        path: "/blogs/view/:id",
        element: <BlogDetails />,
    },
]

export default BlogsRoute