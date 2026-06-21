import apiClient from "../interceptor/interceptor.service";

const deleteParams = async (pathUrl, params, ...rest) => {
  const response = await apiClient.delete(pathUrl, { data: params, ...rest });
  return response;
};

export default deleteParams;
