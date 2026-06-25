import postParams from "../../common/postParams";
import apiClient from "../../interceptor/interceptor.service";

export const loginAPI = (body) => postParams("Sign/Login", body);
export const verifyCodeLogin = (params) =>
  postParams(`Sign/LoginTelegram/${params.verifyCode}/${params.phoneOrGmail}`);
