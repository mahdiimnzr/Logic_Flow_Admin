import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Row, Col, Spinner, Button } from 'reactstrap'
import { Eye, Clock, MessageSquare, FileText, MessageCircle } from 'react-feather'
import { getNewsById, getNewsComments } from '../core/services/api/blogs/blogs.service'

import BlogInfoCard from '../components/blogs/details/BlogInfoCard'
import StatsVertical from '../components/blogs/details/StatsVertical'
import BlogInteractionChart from '../components/blogs/details/BlogInteractionChart'
import BlogContentDisplay from '../components/blogs/details/BlogContentDisplay'
import BlogCommentsList from '../components/blogs/details/BlogCommentsList'

const BlogDetails = () => {

    const { id } = useParams()

    const [activeTab, setActiveTab] = useState('details')

    const { data: articleData, isLoading: isArticleLoading, refetch: refetchArticle } = useQuery({
        queryKey: ['newsDetails', id],
        queryFn: () => getNewsById(id),
        enabled: !!id
    })

    const { data: commentsData, isLoading: isCommentsLoading, refetch: refetchComments } = useQuery({
        queryKey: ['newsComments', id],
        queryFn: () => getNewsComments(id),
        enabled: !!id
    })

    if (isArticleLoading || isCommentsLoading) {
        return <div className="d-flex justify-content-center my-5"><Spinner color="primary" /></div>
    }

    const article = articleData?.detailsNewsDto

    if (!article) return <div className="text-center text-danger my-5">مقاله‌ای یافت نشد!</div>

    const pureText = article?.describe ? article.describe.replace(/(<([^>]+)>)/gi, "") : "";
    const wordCount = pureText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200) || 1;

    const totalComments = article?.commentsCount || 0;
    const totalLikes = article?.currentLikeCount || 0;
    const totalDislikes = article?.currentDissLikeCount || 0;

    const enrichedComments = commentsData?.map(comment => {
        const correctData = article?.commentDtos?.find(dto => dto.id === comment.id);
        return {
            ...comment,
            parentId: correctData?.parentId || comment.parentId
        };
    }) || [];

    return (
        <div className="app-user-view">
            <Row className='align-items-start'>

                <Col xl="4" lg="5" md="12" sm="12" className='mb-2'>
                    <BlogInfoCard article={article} />
                </Col>

                <Col xl="8" lg="7" md="12" sm="12">

                    <div className="d-flex flex-wrap mb-2 gap-1">
                        <Button 
                            color={activeTab === 'details' ? 'primary' : 'transparent'} 
                            onClick={() => setActiveTab('details')}
                            className="d-flex align-items-center"
                        >
                            <FileText size={18} className="me-50" />
                            جزئیات مقاله
                        </Button>
                        <Button 
                            color={activeTab === 'comments' ? 'primary' : 'transparent'} 
                            onClick={() => setActiveTab('comments')}
                            className={`d-flex align-items-center ${activeTab !== 'comments' ? 'text-body' : ''}`}
                        >
                            <MessageCircle size={18} className="me-50" />
                            دیدگاه‌ها
                        </Button>
                    </div>

                    {activeTab === 'details' && (
                        <div className='d-flex flex-column h-100'>
                            <Row>
                                <Col md="4" sm="4" xs="6" className='mb-2'>
                                    <StatsVertical
                                        icon={<Eye size={21} />}
                                        color='info'
                                        stats={article?.currentView?.toString() || "0"}
                                        statTitle='تعداد بازدید'
                                    />
                                </Col>
                                <Col md="4" sm="4" xs="6" className='mb-2'>
                                    <StatsVertical
                                        icon={<MessageSquare size={21} />}
                                        color='warning'
                                        stats={totalComments.toString()}
                                        statTitle='نظرات ثبت شده'
                                    />
                                </Col>
                                <Col md="4" sm="4" xs="12" className='mb-2'>
                                    <StatsVertical
                                        icon={<Clock size={21} />}
                                        color='primary'
                                        stats={`${readingTime} دقیقه`}
                                        statTitle='زمان مطالعه'
                                    />
                                </Col>
                            </Row>

                            <div className="flex-grow-1 mb-2">
                                <BlogInteractionChart likes={totalLikes} dislikes={totalDislikes} />
                            </div>

                            <div className="mb-2">
                                <BlogContentDisplay content={article?.describe} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <div className="mb-2">
                            <BlogCommentsList 
                                allComments={enrichedComments} 
                                refetchComments={() => {
                                    refetchComments();
                                    refetchArticle();
                                }} 
                            />
                        </div>
                    )}

                </Col>
            </Row>
        </div>
    )
}

export default BlogDetails