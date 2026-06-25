import apiClient from "../../interceptor/interceptor.service";

const loginAPI = async (user) => {
    const response = await apiClient.post("Sign/Login",user);
    return response;
};

export default loginAPI