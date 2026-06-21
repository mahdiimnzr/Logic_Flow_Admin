import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 1,
      refetchOnReconnect: true,
    },
  },
});

export default queryClient;
