import apiClient from "../../interceptor/interceptor.service"

export const getAdminBlogsList = async (params) => {

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

export const createNewsBlog = async (formData) => {

    try {
        const response = await apiClient.post("/News/CreateNews", formData);
        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error Creating Blog!", error);
        throw error;
    }
};

export const getNewsCategories = async () => {
    try {
        const response = await apiClient.get("/News/GetListNewsCategory");
        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error Getting Categories!", error);
        return null
    }
};

export const toggleBlogStatus = async (formData) => {

    try {
        const response = await apiClient.put("/News/ActiveDeactiveNews", formData);
        if (response && response.status === 200) {
            return response.data;
        }
        return null
    } catch (error) {
        console.error("Error Toggling!", error);
        throw error
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await apiClient.get(`/News/${id}`);

        if (response && response.status === 200) {
            return response.data;
        }
        return null;

    } catch (error) {
        console.error("Error fetching news details!", error);
        throw error;
    }
};

export const updateNews = async (formData) => {
    try {
        const response = await apiClient.put("/News/UpdateNews", formData);

        if (response && response.status === 200) {
            return response.data;
        }

        return null;

    } catch (error) {
        console.error("Error updating news text!", error);
        throw error;
    }
};

export const updateNewsFile = async (formData) => {
    try {
        const response = await apiClient.put("/News/UpdateNewsFile", formData);

        if (response && response.status === 200) {
            return response.data;
        }
        return null;

    } catch (error) {
        console.error("Error updating news file!", error);
        throw error;
    }
    
};

export const createNewsCategory = async (formData) => {
    try {
        const response = await apiClient.post("/News/CreateNewsCategory",formData);
        
        if (response && response.status === 200) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error("Error Creating Category!", error);
        throw error;
    }
};

export const updateNewsCategory = async (formData) => {
    try {
        const response = await apiClient.put("/News/UpdateNewsCategory", formData);
        
        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        
        console.error("Error Updating Category!", error);
        throw error;
    }
};