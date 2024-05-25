import * as React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Header } from "antd/es/layout/layout";
import Main from "../pages";
import { Menu } from "antd";

const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `Home ${index + 1}`,
}));
const settings = ["Profile", "Account", "Logout"];

interface IRoute {
  name: string;
  path: string;
  component: React.ComponentType;
}

const routes: IRoute[] = [
  {
    name: "Main",
    path: "/",
    component: Main,
  },
];

const HeaderLayout = () => {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
};

export default () => (
  <BrowserRouter>
    <HeaderLayout />
    <Routes>
      {routes.map((route) => (
        <Route
          path={route.path}
          key={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  </BrowserRouter>
);
