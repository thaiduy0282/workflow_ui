import "./index.css";
import "reactflow/dist/style.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Create client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Để chặn trường hợp call lại api khi chuyển màn hình
      retry: 0, // Không cho retry
    },
  },
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        hideIconVariant
        autoHideDuration={3000}
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        preventDuplicate
        style={{
          width: "400px",
          background: "var(--green-600)",
        }}
      >
        <App />
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>
);
