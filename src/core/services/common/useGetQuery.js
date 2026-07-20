import { useQuery } from "@tanstack/react-query";
import apiClient from "../interceptor/interceptor.service";

const useGetQuery = (
  queryKey,
  pathUrl,
  params,
  options = {},
  setParams = true,
) =>
  useQuery({
    queryKey: params && setParams == true ? [queryKey, params] : [queryKey],
    queryFn: async () => {
      const result = await apiClient(pathUrl, { params });
      return result;
    },
    ...options,
  });

export default useGetQuery;
