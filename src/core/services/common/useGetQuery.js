import { useQuery } from "@tanstack/react-query";
import apiClient from "../interceptor/interceptor.service";

const useGetQuery = (queryKey, pathUrl, params, options = {}) =>
  useQuery({
    queryKey: params ? [queryKey, params] : [queryKey],
    queryFn: async () => {
      const result = await apiClient(pathUrl, { params });
      return result;
    },
    ...options,
  });

export default useGetQuery;
