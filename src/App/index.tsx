import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";
import WorkflowSetup from "../pages/WorkflowSetup";
import Main from "../pages/Main";
import { WorkflowProvider } from "../components/context/WorkflowContext";

const { Header } = Layout;

const items = new Array(3).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: `Home ${index + 1}`,
}));

const routes = [
    {
        name: "Workflow Setup",
        path: "/",
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
