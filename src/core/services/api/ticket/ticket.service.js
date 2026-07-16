import apiClient from "../../interceptor/interceptor.service"

export const getAllTicketsAdmin = async (pageNumber = 0, perPage = 10, query = "") => {
    try {
        const response = await apiClient.get(`/ticket/AllTickets?pageNumber=${pageNumber}&perPage=${perPage}&query=${query}`);
        return response.data;
    } catch (error) {
        return false;
    }
};