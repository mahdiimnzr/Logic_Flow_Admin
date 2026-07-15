import apiClient from "../../interceptor/interceptor.service";

export const getSessionDetail = async (sessionId) => {
    try {
        const response = await apiClient.get(`/Session/SessionDetail?SessionId=${sessionId}`);
        
        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching session details!", error);
        throw error;
    }
};

export const getSessionHomeWork = async (sessionId) => {
    try {
        const response = await apiClient.get(`/Session/GetSessionHomeWork?SessionId=${sessionId}`);
        
        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching session homeworks!", error);
        throw error;
    }
};

export const getStudentHomeworkList = async () => {
    try {
        const response = await apiClient.get("/Session/StudentHomeworkList");
        
        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching student homework list!", error);
        throw error;
    }
};

export const addSessionHomework = async (data) => {
    try {
        const response = await apiClient.post("/Session/AddSessionHomeWork", data);
        if (response && response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error adding session homework!", error);
        throw error;
    }
};