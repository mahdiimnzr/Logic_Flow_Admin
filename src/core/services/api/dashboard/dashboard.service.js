import useGetQuery from "../../common/useGetQuery";
import apiClient from "../../interceptor/interceptor.service";

const getLandingReport = async () => {
  const response = await apiClient.get("Home/LandingReport");
  return response.data;
};

const getDashboardAdminReport = async () => {
  const response = await apiClient.get("/Report/DashboardReport");
  return response.data;
};

const getTechnologyReport = async () => {
  const response = await apiClient.get("/Report/DashboardTechnologyReport");
  return response.data;
};
export const useGetCurrentUserDetail = () =>
  useGetQuery("CurrentUserDetail", "SharePanel/GetProfileInfo");

export { getLandingReport };
export { getDashboardAdminReport };
export { getTechnologyReport };
