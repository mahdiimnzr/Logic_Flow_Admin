import React from 'react'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

const BlogContentDisplay = ({ content }) => {
    return (
        <Card>
            <CardHeader className="border-bottom mb-1">
                <CardTitle tag="h4">محتوای مقاله</CardTitle>
            </CardHeader>
            <CardBody>
                {content ? (
                    <div 
                        className="blog-content px-1"
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ 
                            maxHeight: '500px', 
                            overflowY: 'auto',
                            lineHeight: '2'
                        }}
                    />
                ) : (
                    <div className="text-center text-muted py-5">
                        محتوایی برای این مقاله ثبت نشده است.
                    </div>
                )}
            </CardBody>
        </Card>
    )
}

export default BlogContentDisplay