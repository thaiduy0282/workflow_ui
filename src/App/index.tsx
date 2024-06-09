import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ConfigProvider, Layout } from "antd";

import Home from "../pages/Home";
import WorkflowDetail from "../pages/Workflow/detail";
import { WorkflowProvider } from "../components/context/WorkflowContext";

const { Header } = Layout;

const routes = [
  {
    name: "Workflow List",
    path: "/",
    component: Home,
  },
  {
    name: "Workflow Detail",
    path: "/workflow/:workflowId/detail",
    component: WorkflowDetail,
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
      <div style={{ width: "100%", padding: "0 24px" }}>
        <Link
          style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}
          to="/"
        >
          Workflow Application
        </Link>
      </div>
    </Header>
  );
};

const App = () => (
  <WorkflowProvider>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#6dc8ce",
          },
        }}
      >
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
      </ConfigProvider>
    </BrowserRouter>
  </WorkflowProvider>
);

export default App;
