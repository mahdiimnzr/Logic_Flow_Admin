// ** React Imports
import { Fragment, useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";

// ** Invoice List Sidebar
import Sidebar from "./TermsSideBar";

// ** Table Columns
import { columns } from "./TermsColumns";

// ** Debounce Search
import debounce from "debounce";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  ModalHeader,
  ModalBody,
  FormFeedback,
  Modal,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { postTerm } from "../../../core/services/api/ManagementCourses/ManagementCourses.service";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const validationSchema = Yup.object({
  termName: Yup.string().required("نام الزامی است"),
  startDate: Yup.string().required(" انتخواب زمان الزامی است"),
  endDate: Yup.string().required(" انتخواب زمان الزامی است"),
  departmentId: Yup.string().required(" انتخواب بخش الزامی است"),
});
// ** Table Header
const CustomHeader = ({
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  // ** I18n
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const departments = queryClient.getQueryState(["Departments"]);

  const defaultValues = {
    termName: "",
    startDate: "",
    endDate: "",
    departmentId: "",
  };

  const [currentClassRoom, setCurrentClassRoom] = useState({
    value: null,
    label: "انتخواب کنید",
  });

  const departmentList = departments?.data?.data?.map((value) => {
    const terms = { value: value.id, label: value.depName };
    return terms;
  });

  // ** Hooks
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) });

  const { mutate: postTermMutation } = useMutation({
    mutationFn: postTerm,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, _, context) => {
      toast.success(response.data.message, { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["Term"] });
      setShow(false);
      setValue("termName", "");
      setValue("startDate", "");
      setValue("endDate", "");
    },
    onError: (response, _, context) => {
      toast.error(response.data.message, { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    postTermMutation(data);
  };
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center w-100">
            <label htmlFor="rows-per-page">{t("Show")}</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
            <label htmlFor="rows-per-page">{t("Entries")}</label>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <label className="mb-0" htmlFor="search-invoice">
              {t("Search")}
            </label>
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-1">
            <div className="d-flex align-items-center table-header-actions">
              <Button
                onClick={() => setShow(true)}
                className="add-new-user"
                color="primary"
              >
                افزودن ترم
              </Button>
            </div>
            <div className="d-flex align-items-center table-header-actions">
              <Button
                className="add-new-user"
                color="primary"
                onClick={() => setShowModal(true)}
              >
                افزودن زمان
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">افزودن ترم</h1>
          </div>
          <Row
            tag="form"
            className="gy-1 pt-75"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Col xs={12}>
              <Label className="form-label" for="termName">
                نام ترم
              </Label>
              <Controller
                name="termName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="termName"
                    placeholder=" نام ترم"
                    invalid={errors.termName && true}
                  />
                )}
              />
              {errors.termName && (
                <span className="invalid-feedback d-block">
                  {errors.termName.message}
                </span>
              )}
            </Col>
            <Col sm="12" className="mb-1">
              <Label for="departmentId">بخش</Label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className={`react-select ${
                      errors.departmentId ? "is-invalid" : ""
                    }`}
                    classNamePrefix="select"
                    options={departmentList}
                    value={currentClassRoom}
                    placeholder={""}
                    id="departmentId"
                    name="departmentId"
                    onChange={(data) => {
                      setCurrentClassRoom(data);
                      setValue("departmentId", data.value);
                    }}
                  />
                )}
              />
              {errors.departmentId && (
                <div className="invalid-feedback d-block">
                  {t(errors.departmentId.message)}
                </div>
              )}
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for="startDate">
                زمان شروع
              </Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <>
                    <DatePicker
                      id="startDate"
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={field.value ? new Date(field.value) : null}
                      editable={false}
                      placeholder={t("DatePlaceholder")}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date.toDate().toISOString());
                        } else {
                          field.onChange(null);
                        }
                      }}
                      inputClass={`form-control ${
                        errors.startDate ? "is-invalid" : ""
                      }`}
                      containerStyle={{ width: "100%" }}
                    />
                    {errors.startDate && (
                      <span className="invalid-feedback d-block">
                        {errors.startDate.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for="endDate">
                زمان پایان
              </Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <>
                    <DatePicker
                      id="endDate"
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={field.value ? new Date(field.value) : null}
                      editable={false}
                      placeholder={t("DatePlaceholder")}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date.toDate().toISOString());
                        } else {
                          field.onChange(null);
                        }
                      }}
                      inputClass={`form-control ${
                        errors.endDate ? "is-invalid" : ""
                      }`}
                      containerStyle={{ width: "100%" }}
                    />
                    {errors.endDate && (
                      <span className="invalid-feedback d-block">
                        {errors.endDate.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Col>

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button type="submit" className="me-1" color="primary">
                تغیرات
              </Button>
              <Button color="secondary" outline onClick={() => setShow(false)}>
                منصرف
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShowModal(!showModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">ساخت تاریخ بسته بودن</h1>
          </div>
          <Row
            tag="form"
            className="gy-1 pt-75"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Col xs={12}>
              <Label className="form-label" for="termName">
                نام ترم
              </Label>
              <Controller
                name="termName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="termName"
                    placeholder=" نام ترم"
                    invalid={errors.termName && true}
                  />
                )}
              />
              {errors.termName && (
                <span className="invalid-feedback d-block">
                  {errors.termName.message}
                </span>
              )}
            </Col>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="startDate">
                زمان شروع
              </Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <>
                    <DatePicker
                      id="startDate"
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={field.value ? new Date(field.value) : null}
                      editable={false}
                      placeholder={t("DatePlaceholder")}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date.toDate().toISOString());
                        } else {
                          field.onChange(null);
                        }
                      }}
                      inputClass={`form-control ${
                        errors.startDate ? "is-invalid" : ""
                      }`}
                      containerStyle={{ width: "100%" }}
                    />
                    {errors.startDate && (
                      <span className="invalid-feedback d-block">
                        {errors.startDate.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for="endDate">
                زمان پایان
              </Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <>
                    <DatePicker
                      id="endDate"
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      value={field.value ? new Date(field.value) : null}
                      editable={false}
                      placeholder={t("DatePlaceholder")}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date.toDate().toISOString());
                        } else {
                          field.onChange(null);
                        }
                      }}
                      inputClass={`form-control ${
                        errors.endDate ? "is-invalid" : ""
                      }`}
                      containerStyle={{ width: "100%" }}
                    />
                    {errors.endDate && (
                      <span className="invalid-feedback d-block">
                        {errors.endDate.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Col>

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button type="submit" className="me-1" color="primary">
                تغیرات
              </Button>
              <Button
                color="secondary"
                outline
                onClick={() => setShowModal(false)}
              >
                منصرف
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

const UsersList = ({ termList }) => {
  // ** Redux
  const dispatch = useDispatch();

  // ** I18n
  const { t } = useTranslation();

  // ** States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const displayData = useMemo(() => {
    if (!termList) return [];
    if (debounceSearch.trim() === "") return termList;
    else {
      return termList.filter((value) =>
        value.termName.toLowerCase().includes(debounceSearch.toLowerCase()),
      );
    }
  }, [debounceSearch, termList]);

  const count = Number(Math.ceil(displayData?.length / rowsPerPage));

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return displayData?.slice(start, start + rowsPerPage);
  }, [displayData, currentPage, rowsPerPage]);

  // ** Function in get data on page change
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
    handleSearch(val);
  };
  console.log(debounceSearch);
  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const search = value.trim();
        setDebounceSearch(search);
      }, 1000),
    [displayData],
  );

  // ** Update Current Page If That Page Doesn`t Exist
  useEffect(() => {
    if (currentPage > count) {
      setCurrentPage(count || 1);
    }
  }, [count]);

  // ** Custom Pagination
  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            pagination
            responsive
            paginationServer
            columns={columns}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={currentPageData}
            subHeaderComponent={
              <CustomHeader
                store={currentPageData}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default UsersList;
