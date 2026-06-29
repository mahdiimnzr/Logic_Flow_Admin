import { useQueries } from "@tanstack/react-query";
import apiClient from "../interceptor/interceptor.service";

const useGetQueries = (queries) =>
  useQueries({
    queries: queries.map(({ queryKey, pathUrl, params, enabled }) => ({
      queryKey: [queryKey],
      queryFn: async () => {
        const result = await apiClient(pathUrl, { params });
        return result;
      },
      enabled,
    })),
  });

export default useGetQueries;
