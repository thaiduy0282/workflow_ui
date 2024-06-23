import "./index.css";
import "reactflow/dist/style.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import AntThemeProvider from "./theme/AntThemeProvider";

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
      <AntThemeProvider>
        <ThemeProvider>
          <SnackbarProvider
            hideIconVariant
            autoHideDuration={3000}
            maxSnack={1}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            preventDuplicate
            style={{
              width: "400px",
              border: "1px solid #B7EB8F",
              background: "#F6FFED",
              color: "#000",
              height: "38px !important",
              borderRadius: "8px",
            }}
          >
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </AntThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
