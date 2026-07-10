import { Fragment, useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { columns } from "./TermsColumns";
import debounce from "debounce";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { selectThemeColors } from "@utils";
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
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  postAddTermCloseDate,
  postTerm,
} from "../../../core/services/api/ManagementCourses/ManagementCourses.service";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddCloseDateModal from "./AddCloseDateModal";

const validationSchema = Yup.object({
  termName: Yup.string().required("TermNameRequired"),
  startDate: Yup.date().nullable().required("StartDateRequired"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "EndDateAfterStart")
    .nullable()
    .required("EndDateRequired"),
  departmentId: Yup.string().required("DepartmentRequired"),
});

const CustomHeader = ({
  termList,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [addCloseDateModal, setAddCloseDateModal] = useState(false);

  const toggleAddCloseDate = () => setAddCloseDateModal(!addCloseDateModal);

  const departments = queryClient.getQueryState(["Departments"]);

  const departmentList = departments?.data?.data?.map((value) => ({
    value: value.id,
    label: value.depName,
  }));

  const defaultValues = {
    termName: "",
    startDate: null,
    endDate: null,
    departmentId: "",
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

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
      setValue("startDate", null);
      setValue("endDate", null);
      setValue("departmentId", "");
    },
    onError: (_, context) => {
      toast.error(t("ErrorOccurred"), { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    postTermMutation(data);
  };

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row className="d-flex justify-content-between">
        <Col
          xl="4"
          className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
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
            <Button color="primary" onClick={() => setShow(true)}>
              {t("AddTerm")}
            </Button>
            <Button color="primary" onClick={toggleAddCloseDate}>
              {t("AddCloseDate")}
            </Button>
          </div>
        </Col>

        <Col xl="2" className="d-flex align-items-center p-0 justify-content-xl-end justify-content-start">
          <div className="d-flex align-items-center">
            <label htmlFor="rows-per-page">{t("Show")}</label>
            <Input
              className="mx-50"
              dir="ltr"
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
      </Row>

      {/* Add Term Modal */}
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
        style={{ fontFamily: "IRANYekanXFaNum" }}
      >
        <ModalHeader toggle={() => setShow(!show)}>
          {t("AddTerm")}
        </ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <Row tag="form" className="gy-1 pt-75" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className="form-label" for="termName">
                {t("TermName")}
              </Label>
              <Controller
                name="termName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="termName"
                    placeholder={t("TermName")}
                    invalid={!!errors.termName}
                  />
                )}
              />
              {errors.termName && (
                <span className="invalid-feedback d-block">
                  {t(errors.termName.message)}
                </span>
              )}
            </Col>

            <Col sm="12" className="mb-1">
              <Label for="departmentId">{t("Department")}</Label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className={`react-select ${errors.departmentId ? "is-invalid" : ""}`}
                    classNamePrefix="select"
                    options={departmentList || []}
                    value={departmentList?.find(d => d.value === field.value) || null}
                    onChange={(data) => {
                      setValue("departmentId", data?.value);
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
                {t("StartDate")}
              </Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={field.value ? new Date(field.value) : null}
                      editable={false}
                      placeholder={t("DatePlaceholder")}
                      onChange={(date) => field.onChange(date ? date.toDate().toISOString() : null)}
                      inputClass={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                      containerStyle={{ width: "100%" }}
                    />
                    {errors.startDate && (
                      <span className="invalid-feedback d-block">
                        {t(errors.startDate.message)}
                      </span>
                    )}
                  </>
                )}
              />
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for="endDate">
                {t("EndDate")}
              </Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={field.value ? new Date(field.value) : null}
                      editable={false}
                      placeholder={t("DatePlaceholder")}
                      onChange={(date) => field.onChange(date ? date.toDate().toISOString() : null)}
                      inputClass={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                      containerStyle={{ width: "100%" }}
                    />
                    {errors.endDate && (
                      <span className="invalid-feedback d-block">
                        {t(errors.endDate.message)}
                      </span>
                    )}
                  </>
                )}
              />
            </Col>

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button type="submit" className="me-1" color="primary">
                {t("Submit")}
              </Button>
              <Button color="secondary" outline onClick={() => setShow(false)}>
                {t("Cancel")}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <AddCloseDateModal
        toggle={toggleAddCloseDate}
        termList={termList}
        isOpen={addCloseDateModal}
      />
    </div>
  );
};

const TermsList = ({ termList, isFetching }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [debounceSearch, setDebounceSearch] = useState("");

  const displayData = useMemo(() => {
    if (!termList) return [];
    if (!debounceSearch.trim()) return termList;
    return termList.filter((value) =>
      value.termName?.toLowerCase().includes(debounceSearch.toLowerCase())
    );
  }, [termList, debounceSearch]);

  const count = Math.ceil(displayData.length / rowsPerPage) || 1;

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return displayData.slice(start, start + rowsPerPage);
  }, [displayData, currentPage, rowsPerPage]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
  };

  const handleFilter = (val) => {
    setSearchTerm(val);
    handleSearch(val);
  };

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        setDebounceSearch(value.trim());
      }, 1000),
    []
  );

  useEffect(() => {
    if (currentPage > count) {
      setCurrentPage(count);
    }
  }, [count, currentPage]);

  const CustomPagination = () => (
    <div className="d-flex align-items-center justify-content-end gap-1">
      {isFetching && <Spinner />}
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        pageCount={count}
        activeClassName="active"
        forcePage={currentPage - 1}
        onPageChange={handlePagination}
        pageClassName="page-item"
        nextClassName="page-item next"
        previousClassName="page-item prev"
        pageLinkClassName="page-link"
        nextLinkClassName="page-link"
        previousLinkClassName="page-link"
        containerClassName="pagination react-paginate justify-content-end my-2 pe-1"
      />
    </div>
  );

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
            columns={columns(t)}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={currentPageData}
            subHeaderComponent={
              <CustomHeader
                termList={termList}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
              />
            }
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default TermsList;