import apiClient from "../interceptor/interceptor.service";

const putParams = async (pathUrl, param) => {
  const response = await apiClient.put(pathUrl, param);
  return response;
};

export default putParams;
