import { Link, useNavigate } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Row, Col, CardTitle, CardText, Button, Form, Input } from "reactstrap";
import illustrationsLight from "@src/assets/images/pages/two-steps-verification-illustration.svg";
import illustrationsDark from "@src/assets/images/pages/two-steps-verification-illustration-dark.svg";
import { verifyCodeLogin } from "../../core/services/api/auth/auth.service";
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useRef, useState } from "react";

const TwoStepsCover = ({ loginState, setIsLogin }) => {
  const { skin } = useSkin();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const otpRefs = useRef([]);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const validationSchema = Yup.object({
    verifyCode: Yup.string()
      .length(6, t("TwoStepCodeError"))
      .required(t("TwoStepCodeError")),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneOrGmail: loginState.phoneOrGmail,
      verifyCode: "",
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const code = otpDigits.join("");
    setValue("verifyCode", code);
  }, [otpDigits, setValue]);

  const { mutate: verifyMutate } = useMutation({
    mutationFn: verifyCodeLogin,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (result, _, context) => {
      if (result.data.success) {
        toast.success(result.data.message, { id: context.toastId });
        navigate("/");
        localStorage.setItem("token", JSON.stringify(result.data.token));
      } else {
        toast.error(result.data.message, { id: context.toastId });
      }
    },
    onError: (err, _, context) => {
      toast.error(err?.data?.message || "Verification failed", {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => {
    verifyMutate(data);
  };

  const handleDigitChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newDigits = [...otpDigits];

      if (newDigits[index]) {
        newDigits[index] = "";
        setOtpDigits(newDigits);
        return;
      }

      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData) {
      const newDigits = Array(6).fill("");
      pastedData.split("").forEach((digit, i) => {
        newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pastedData.length, 5);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 139 95" version="1.1" height="28">
            <defs>
              <linearGradient
                x1="100%"
                y1="10.5120544%"
                x2="50%"
                y2="89.4879456%"
                id="linearGradient-1"
              >
                <stop stopColor="#000000" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="64.0437835%"
                y1="46.3276743%"
                x2="37.373316%"
                y2="100%"
                id="linearGradient-2"
              >
                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Artboard" transform="translate(-400.000000, -178.000000)">
                <g id="Group" transform="translate(400.000000, 178.000000)">
                  <path
                    d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                    id="Path"
                    className="text-primary"
                    style={{ fill: "currentColor" }}
                  ></path>
                  <path
                    d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                    id="Path"
                    fill="url(#linearGradient-1)"
                    opacity="0.2"
                  ></path>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.049999997"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                  ></polygon>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.099999994"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                  ></polygon>
                  <polygon
                    id="Path-3"
                    fill="url(#linearGradient-2)"
                    opacity="0.099999994"
                    points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>
          <h2 className="brand-text text-primary ms-1">Vuexy</h2>
        </Link>

        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} />
          </div>
        </Col>

        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bolder mb-1">
              {t("TwoStepTitle")}
            </CardTitle>
            <CardText className="mb-75">{t("TwoStepSubtitle")}</CardText>
            <CardText className="fw-bolder mb-2">
              {loginState?.phoneOrGmail}
            </CardText>
            <Controller
              name="verifyCode"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
              <h6 className="mb-1">{t("TwoStepInputLabel")}</h6>
              <div
                dir="ltr"
                className="auth-input-wrapper d-flex align-items-center justify-content-between"
                onPaste={handlePaste}
              >
                {otpDigits.map((_, index) => (
                  <Input
                    key={index}
                    innerRef={(el) => (otpRefs.current[index] = el)}
                    id={`digit-${index}`}
                    autoFocus={index === 0}
                    maxLength={1}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className={`auth-input height-50 text-center numeral-mask mx-25 mb-1${
                      errors.verifyCode ? " border-danger" : ""
                    }`}
                    value={otpDigits[index]}
                    onChange={(e) => handleDigitChange(e, index)}
                    onKeyDown={(e) => handleDigitKeyDown(e, index)}
                  />
                ))}
              </div>

              {errors.verifyCode && (
                <span className="text-danger" style={{ fontSize: "12px" }}>
                  {errors.verifyCode.message}
                </span>
              )}

              <Button block type="submit" color="primary" className="mt-1">
                {t("SignIn")}
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span>{t("TwoStepNoCode")}</span>{" "}
              <a href="/" onClick={(e) => e.preventDefault()}>
                {t("TwoStepResend")}
              </a>{" "}
              <span>{t("TwoStepOr")}</span>{" "}
              <a href="/" onClick={(e) => e.preventDefault()}>
                {t("TwoStepCallUs")}
              </a>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default TwoStepsCover;
