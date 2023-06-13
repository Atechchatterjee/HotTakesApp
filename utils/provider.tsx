"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Providers({ children }: React.PropsWithChildren) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        retry: false, //TODO: change while pushing to production
        cacheTime: 100,
      },
    },
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
