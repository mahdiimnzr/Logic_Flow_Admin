// ** React Imports
import { Fragment, useState } from "react";

// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import { useGetCourseAdd } from "../../../../core/services/api/CourseList/courseList.service";

// ** Utils
import { selectThemeColors } from "@utils";

const defaultValues = {
  city: "",
  pincode: "",
  address: "",
  landmark: "",
};

const Address = ({ stepper }) => {
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { data: courseAdd } = useGetCourseAdd();

  const [currentTechnology, setCurrentTechnology] = useState({
    value: "",
    label: "انتخواب کنید",
  });
  const technologyList = courseAdd?.data?.technologyDtos?.map((value) => {
    const technology = { value: value.id, label: value.techName };
    return technology;
  });

  const onSubmit = (data) => {
    stepper.next();
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Address</h5>
        <small>Enter Your Address.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="تکنولوژی ها">
              تکنولوژی ها
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={`تکنولوژی ها`}
              value={currentTechnology}
              options={technologyList}
              onChange={(data) => {
                setCurrentTechnology(data);
              }}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">قبلی</span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">بعدی</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default Address;
