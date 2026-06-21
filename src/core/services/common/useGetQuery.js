import { useQuery } from "@tanstack/react-query";
import apiClient from "../interceptor/interceptor.service";

const useGetQuery = (queryKey, pathUrl, params) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const result = await apiClient(pathUrl, { params: params });
      return result;
    },
  });

export default useGetQuery;
