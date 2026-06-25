import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import LoginBasic from "../components/auth/LoginBasic";
import { useRTL } from "../utility/hooks/useRTL";
import TwoStepsCover from "../components/auth/LoginTwoStep";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [isRTL] = useRTL();
  const [step, setStep] = useState("first");
  const [loginState, setLoginState] = useState({
    phoneOrGmail: "",
  });
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
      toast.error("برای ورود به حساب کاربری ابتدا از حساب فعلی خود خارج شوید");
    }
  }, []);
  return (
    <Fragment>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        style={{ fontFamily: isRTL ? "IRANYekanXFaNum" : "feather" }}
        className="auth-wrapper auth-cover"
      >
        {step === "first" ? (
          <LoginBasic setLoginState={setLoginState} setStep={setStep} />
        ) : (
          <TwoStepsCover loginState={loginState} />
        )}
      </div>
    </Fragment>
  );
};

export default Login;
