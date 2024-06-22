import { BrowserRouter, Route, Routes } from "react-router-dom";

import { WorkflowProvider } from "../components/context/WorkflowContext";
import Home from "../pages/Home";
import WorkflowDetail from "../pages/Workflow/detail";
import { HeaderLayout } from "../components/layout/Header";
import { ContainerLayout } from "../components/layout/ContainerLayout";

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

const App = () => (
  <WorkflowProvider>
    <BrowserRouter>
      <HeaderLayout />
      <ContainerLayout>
        <Routes>
          {routes.map((route) => (
            <Route
              path={route.path}
              key={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </ContainerLayout>
    </BrowserRouter>
  </WorkflowProvider>
);

export default App;
