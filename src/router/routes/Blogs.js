import { lazy } from "react"

import React from 'react'

const BlogsList = lazy(() => import("../../pages/BlogsList"))
const BlogAdd = lazy(() => import("../../pages/BlogAdd"))


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
]

export default BlogsRoute