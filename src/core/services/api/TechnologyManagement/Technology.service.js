import postParams from "../../common/postParams";
import putParams from "../../common/putParams";
import useGetQuery from "../../common/useGetQuery";

export const useGetTechnology = () => useGetQuery("Technology", "Technology");

export const updateTechnology = (body) => putParams("/Technology", body);
export const postTechnology = (body) => postParams("/Technology", body);
