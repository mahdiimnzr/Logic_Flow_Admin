import React from 'react';
import { Card, CardHeader, CardTitle, Table, Badge } from 'reactstrap';
import { Eye } from 'react-feather';

const TopBlogsTable = ({ blogs = [] }) => {
  return (
    <Card className="card-company-table h-100">
      <CardHeader>
        <CardTitle tag="h4">مقالات پربازدید</CardTitle>
      </CardHeader>
      
      <div className="table-responsive">
        <Table hover borderless className="mb-0">
          <thead className="table-light">
            <tr>
              <th>عنوان مقاله</th>
              <th> دسته‌بندی</th>
              <th>تعداد بازدید</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar rounded bg-light-info me-1">
                        <div className="avatar-content">
                          {blog.currentImageAddressTumb && blog.currentImageAddressTumb !== "null" && blog.currentImageAddressTumb !== "" ? (
                            <img src={blog.currentImageAddressTumb} alt={blog.title} width="32" height="32" className="rounded" />
                          ) : (
                            <span className="text-info fw-bolder">
                              {blog.title ? blog.title.substring(0, 1) : 'م'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="fw-bolder">{blog.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-bolder text-muted">{blog.addUserFullName || 'نویسنده ناشناس'}</span>
                      <small className="text-muted">{blog.newsCatregoryName || 'بدون دسته‌بندی'}</small>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bolder text-heading">
                      <Eye size={14} className="me-50 text-muted" />
                      {blog.currentView ? blog.currentView.toLocaleString('fa-IR') : '۰'}
                    </span>
                  </td>
                  <td>
                    <Badge color={blog.active ? 'light-success' : 'light-secondary'} pill>
                      {blog.active ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3 text-muted">
                  مقاله‌ای یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default TopBlogsTable;
