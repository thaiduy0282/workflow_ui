import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import { Layout } from "antd";
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
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
          Workflow Application
        </div>
      </div>
    </Header>
  );
};

const App = () => (
  <WorkflowProvider>
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
  </WorkflowProvider>
);

export default App;
