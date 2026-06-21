import apiClient from "../interceptor/interceptor.service";

const postParams = async (pathUrl, param) => {
  const response = await apiClient.post(pathUrl, param);
  return response;
};

export default postParams;
