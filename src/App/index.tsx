import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";
import WorkflowSetup from "../pages/WorkflowSetup";
import Main from "../pages";
import { WorkflowProvider } from "../components/context/WorkflowContext";
import WorkflowList from "../pages/WorkflowList";

const { Header } = Layout;

const routes = [
    {
        name: "Workflow List",
        path: "/",
        component: WorkflowList
    },
    {
        name: "Workflow Setup",
        path: "/create",
        component: WorkflowSetup,
    },
    {
        name: "Main",
        path: "/main",
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
                padding: "0 24px",
            }}
        >
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                Workflow Application
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
