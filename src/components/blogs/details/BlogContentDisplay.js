import React from 'react'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import HandleIdentityEditorJs from '../../common/EditorDetailValidation'

const BlogContentDisplay = ({ content }) => {
    return (
        <Card>
            <CardHeader className="border-bottom mb-1">
                <CardTitle tag="h4">محتوای مقاله</CardTitle>
            </CardHeader>
            <CardBody>
                {content ? (
                    <HandleIdentityEditorJs desc={content} />
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