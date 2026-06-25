import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSkin } from "@hooks/useSkin";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import { AbilityContext } from "@src/utility/context/Can";
import InputPasswordToggle from "@components/input-password-toggle";
import { getHomeRouteForLoggedInUser } from "@utils";
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  CardText,
  CardTitle,
} from "reactstrap";
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import "@styles/react/pages/page-authentication.scss";
import { loginAPI } from "../../core/services/api/auth/auth.service";

const Login = ({ setLoginState, setStep }) => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ability = useContext(AbilityContext);

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const loginSchema = Yup.object().shape({
    phoneOrGmail: Yup.string().required(t("EmailRequired")),
    password: Yup.string()
      .required(t("PasswordRequired"))
      .min(8, t("PasswordMin")),
    rememberMe: Yup.boolean(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneOrGmail: "",
      password: "",
      rememberMe: false,
    },
    resolver: yupResolver(loginSchema),
  });

  const { mutate: loginMutate } = useMutation({
    mutationFn: loginAPI,
    onMutate: () => {
      const toastId = toast.loading(t("Loading"));
      return { toastId };
    },
    onSuccess: (response, variables, context) => {
      if (response.data.success) {
        toast.success(response.data.message, { id: context.toastId });
        if (response.data.token) {
          navigate("/");
          localStorage.setItem("token", JSON.stringify(response.data.token));
        } else {
          setStep("second");
          setLoginState({ phoneOrGmail: variables.phoneOrGmail });
        }
      } else {
        toast.error(response.data.message, { id: context.toastId });
      }
    },
    onError: (response, _, context) => {
      toast.error(response?.data?.message, { id: context.toastId });
    },
  });

  const onSubmit = (data) => {
    loginMutate(data);
  };

  return (
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
              <stop stopColor="#000000" offset="0%" />
              <stop stopColor="#FFFFFF" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="64.0437835%"
              y1="46.3276743%"
              x2="37.373316%"
              y2="100%"
              id="linearGradient-2"
            >
              <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%" />
              <stop stopColor="#FFFFFF" offset="100%" />
            </linearGradient>
          </defs>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-400.000000, -178.000000)">
              <g transform="translate(400.000000, 178.000000)">
                <path
                  d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                  className="text-primary"
                  style={{ fill: "currentColor" }}
                />
                <path
                  d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                  fill="url(#linearGradient-1)"
                  opacity="0.2"
                />
                <polygon
                  fill="#000000"
                  opacity="0.049999997"
                  points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                />
                <polygon
                  fill="#000000"
                  opacity="0.099999994"
                  points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                />
                <polygon
                  fill="url(#linearGradient-2)"
                  opacity="0.099999994"
                  points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                />
              </g>
            </g>
          </g>
        </svg>
        <h2 className="brand-text text-primary ms-1">Vuexy</h2>
      </Link>

      <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
        <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <img className="img-fluid" src={source} alt="Login Cover" />
        </div>
      </Col>

      <Col
        className="d-flex align-items-center auth-bg px-2 p-lg-5"
        lg="4"
        sm="12"
      >
        <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
          <CardTitle tag="h2" className="fw-bold mb-1">
            {t("WelcomeTitle")}
          </CardTitle>
          <CardText className="mb-2">{t("WelcomeSubtitle")}</CardText>

          <Form
            className="auth-login-form mt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-1">
              <Label className="form-label" for="login-email">
                {t("Email")}
              </Label>
              <Controller
                name="phoneOrGmail"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      {...field}
                      autoFocus
                      type="text"
                      id="login-email"
                      placeholder={t("EmailPlaceholder")}
                      className={errors.phoneOrGmail ? "border-danger" : ""}
                    />
                    {errors.phoneOrGmail && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.phoneOrGmail.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            <div className="mb-1">
              <Label className="form-label" for="password">
                {t("Password")}
              </Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <>
                    <InputPasswordToggle
                      {...field}
                      placeholder={t("Password")}
                      id="password"
                      htmlFor="password"
                      className={`input-group-merge${
                        errors.password ? " border-danger" : ""
                      }`}
                    />
                    {errors.password && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "12px" }}
                      >
                        {errors.password.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            <div className="form-check mb-1">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Input
                    {...rest}
                    type="checkbox"
                    id="remember-me"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <Label className="form-check-label" for="remember-me">
                {t("RememberMe")}
              </Label>
            </div>

            <Button type="submit" color="primary" block>
              {t("SignIn")}
            </Button>
          </Form>

          <div className="divider my-2">
            <div className="divider-text">or</div>
          </div>

          <div className="auth-footer-btn d-flex justify-content-center">
            <Button color="facebook">
              <Facebook size={14} />
            </Button>
            <Button color="twitter">
              <Twitter size={14} />
            </Button>
            <Button color="google">
              <Mail size={14} />
            </Button>
            <Button className="me-0" color="github">
              <GitHub size={14} />
            </Button>
          </div>
        </Col>
      </Col>
    </Row>
  );
};

export default Login;
