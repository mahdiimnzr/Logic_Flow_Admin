import apiClient from "../../interceptor/interceptor.service";

const getAdminBlogsList = async (params) => {
  const response = await apiClient.get("/News/AdminNewsFilterList", {
    params: {
      pageNumber: params?.pageNumber || 1,
      RowsoFPage: params?.RowsoFPage || 10,
      SortingCol: params?.SortingCol || "InsertDate",
      SorType: params?.SortType || "DESC",
      Query: params?.Query || "",
      IsActive: params?.IsActive,
    },
  });

  if (response && response.status === 200) {
    return response.data;
  }

  console.error("Error Fetching Blogs List!", response);
  return null;
};

export { getAdminBlogsList };
