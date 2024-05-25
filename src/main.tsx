import "./index.css";
import "reactflow/dist/style.css";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { theme } from "./themes/Theme";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
