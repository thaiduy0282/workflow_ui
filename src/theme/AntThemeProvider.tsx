"use client";

import React from "react";

import { ConfigProvider } from "antd";
import useTheme from "../hooks/useTheme";
import createThemeToken from ".";

const AntThemeProvider = ({ children }: React.PropsWithChildren) => {
  const { theme } = useTheme();

  return (
    <ConfigProvider theme={createThemeToken(theme)}>{children}</ConfigProvider>
  );
};

export default AntThemeProvider;
