import useGetQuery from "../../common/useGetQuery";
import apiClient from "../../interceptor/interceptor.service";

export const getLandingReport = async () => {
  const response = await apiClient.get("Home/LandingReport");
  return response.data;
};

export const getDashboardAdminReport = async () => {
  const response = await apiClient.get("/Report/DashboardReport");
  return response.data;
};

export const getTechnologyReport = async () => {
  const response = await apiClient.get("/Report/DashboardTechnologyReport");
  return response.data;
};
export const useGetCurrentUserDetail = () =>
  useGetQuery("CurrentUserDetail", "SharePanel/GetProfileInfo");

export const getAllTeachers = async () => {
  try {
    const response = await apiClient.get("/Home/GetTeachers");
    return response;
  } catch (error) {
    console.error("خطا در دریافت لیست اساتید", error);
    return null;
  }
};

export const getAdminCourseList = async ({
  PageNumber = 1,
  RowsOfPage = 10,
  SortingCol = "DESC"
} = {}) => {

  try {
    const response = await apiClient.get(
      `/Course/CourseList?PageNumber=${PageNumber}&RowsOfPage=${RowsOfPage}&SortingCol=${SortingCol}`
    );
    return response;
  } catch (error) {
    console.error("خطا در دریافت لیست دوره‌ها", error);
    return null;
  }
};

export const getAdminUserList = async (params) => {
  try {
    const response = await apiClient.get("/User/UserMannage", {
      params: {
        PageNumber: params?.PageNumber || 1,
        RowsOfPage: params?.RowsOfPage || 500,
      },
    });
    return response.data;

  } catch (error) {

    console.error("خطا در دریافت لیست یوزرها!", error);
    return null;
  }
};