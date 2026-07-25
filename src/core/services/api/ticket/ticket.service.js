import apiClient from "../../interceptor/interceptor.service"

export const getAllTicketsAdmin = async (pageNumber = 0, perPage = 10, query = "") => {
    try {
        const response = await apiClient.get(`/ticket/AllTickets?pageNumber=${pageNumber}&perPage=${perPage}&query=${query}`);
        return response.data;
    } catch (error) {
        return false;
    }
};

export const acceptTicketAdmin = async (ticketId) => {
    try {
        const response = await apiClient.patch(`/ticket/acceptTicket/${ticketId}`);
        return response.data;
    } catch (error) {
        return false;
    }
};

export const sendTicketMessageAdmin = async (messageData) => {
    try {
        const response = await apiClient.post("/ticket/message/sendSupport", messageData);
        return response.data;
    } catch (error) {
        return false;
    }
};

export const getTicketDetailUser = async (ticketId) => {
    try {
        const response = await apiClient.get(`/ticket/message/chatDetailUser/${ticketId}`);
        return response.data;
    } catch (error) {
        return false;
    }
};

export const getNotAcceptedTicketsSupporter = async (pageNumber = 0, perPage = 1000, query = "") => {
    try {
        const response = await apiClient.get(`/ticket/AllTicketsNotAccepted?pageNumber=${pageNumber}&perPage=${perPage}&query=${query}`);
        return response.data;
    } catch (error) {
        return false;
    }
};

export const getMyTicketsSupporter = async (pageNumber = 0, perPage = 1000, query = "") => {
    try {
        const response = await apiClient.get(`/ticket/AllTicketsMine?pageNumber=${pageNumber}&perPage=${perPage}&query=${query}`);
        return response.data;
    } catch (error) {
        return false;
    }
};

export const getTicketAutoComplete = async (text) => {
  try {
    const response = await apiClient.get(`/ticket/autoComplete/${text}`);
    return response.data;
  } catch (error) {
    return [];
  }
};