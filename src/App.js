import React, { Suspense } from "react";

// ** Router Import
import Router from "./router/Router";
import queryClient from "./configs/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </Suspense>
  );
};

export default App;
