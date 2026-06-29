import React from "react";

import { Card, CardBody } from "reactstrap";
import classNames from "classnames";

export const BlogFilterCard = ({ title, count, icon, color, isActive, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={classNames("cursor-pointer", { "border-primary shadow-sm": isActive })}
      style={{ transition: "all 0.2s", border: isActive ? `1px solid var(--bs-${color})` : "1px solid transparent" }}
    >
      <CardBody className="d-flex align-items-center justify-content-between">
        <div className={`avatar bg-light-${color} p-50`}>
          <span className="avatar-content">{icon}</span>
        </div>
        <div className="text-end">
          <h3 className="mb-0 fw-bolder">{count}</h3>
          <span className="text-muted">{title}</span>
        </div>
      </CardBody>
    </Card>
  )
}

export default BlogFilterCard
