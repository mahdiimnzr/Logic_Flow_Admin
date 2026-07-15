import { Fragment } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody, Button } from "reactstrap";
import { Info, FileText, CheckSquare, Plus } from "react-feather";

const SessionTabs = ({ activeTab, toggleTab, sessionId, toggleHomeworkModal, toggleFileModal }) => {

  return (
    <Fragment>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
            <Info size={18} className="me-50" />
            <span className="fw-bold">اطلاعات جلسه</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
            <FileText size={18} className="me-50" />
            <span className="fw-bold">فایل‌های ضمیمه</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
            <CheckSquare size={18} className="me-50" />
            <span className="fw-bold">تکالیف</span>
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Card>
            <CardBody>
              <h5 className="mb-1">جزئیات و توضیحات</h5>
              <p className="text-muted">
                اطلاعات واقعی در اینجا قرار داده می‌شود.
              </p>
            </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="2">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">لیست فایل‌های جلسه</h5>
                <Button color="primary" size="sm" onClick={toggleFileModal}>
                  <Plus size={14} className="me-50" />
                  افزودن فایل جدید
                </Button>
              </div>
              <p className="text-muted text-center py-3">فایلی برای این جلسه ثبت نشده است.</p>
            </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="3">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">لیست تکالیف جلسه</h5>
                <Button color="primary" size="sm" onClick={toggleHomeworkModal}>
                  <Plus size={14} className="me-50" />
                  ایجاد تکلیف جدید
                </Button>
              </div>
              <p className="text-muted text-center py-3">تکلیفی برای این جلسه ثبت نشده است.</p>
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>
    </Fragment>
  );
};

export default SessionTabs;