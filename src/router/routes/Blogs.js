import { lazy } from "react"

import React from 'react'

import BlogsList from "../../pages/BlogsList"

const BlogsRoute = [
    {
        path:"/blogs/list",
        element: <BlogsList />,
    },
]

export default BlogsRoute