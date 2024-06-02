import React, { useEffect, useState } from "react";
import { Layout, Row, Menu, Button, Tooltip } from "antd";
import axios from "axios";
import WorkflowTable from "./WorkflowTable";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Content } = Layout;

const EnhancedTableToolbar: React.FC<{ numSelected: number; onDeleteAllFunc: () => void; setCurrentTab: (key: string) => void; currentTab: string }> = ({
                                                                                                                                                            numSelected,
                                                                                                                                                            onDeleteAllFunc,
                                                                                                                                                            setCurrentTab,
                                                                                                                                                            currentTab,
                                                                                                                                                        }) => {
    const deleteAllFunc = () => {
        onDeleteAllFunc();
    };

    return (
        <div style={{ backgroundColor: "white" }}>
            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                onClick={(e) => setCurrentTab(e.key)}
                items={[
                    { key: "1", label: "Workflow" },
                    { key: "2", label: "Process" },
                ]}
                style={{ marginBottom: "10px" }}
            />
            <Row justify="end" style={{ padding: "0 24px" }}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <Button type="primary" icon={<DeleteOutlined />} onClick={deleteAllFunc} />
                    </Tooltip>
                ) : (
                    currentTab === "1" && (
                        <Link to="/create">
                            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: "10px" }}>
                                Create
                            </Button>
                        </Link>
                    )
                )}
            </Row>
        </div>
    );
};

const WorkflowList: React.FC = () => {
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof any>("type");
    const [selectedWorkflow, setSelectedWorkflow] = useState<readonly string[]>([]);
    const [selectedProcess, setSelectedProcess] = useState<readonly string[]>([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState<any[]>([]);
    const [processRows, setProcessRows] = useState<any[]>([]);
    const [totalWorkflows, setTotalWorkflows] = useState(0);
    const [totalProcesses, setTotalProcesses] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState("1");

    const fetchData = async (currentTab: string, page: number, size: number) => {
        setLoading(true);
        try {
            if (currentTab === "1") {
                const response = await axios.get(`http://20.191.97.36:8090/v1/workflow?page=${page - 1}&size=${size}`);
                setRows(response.data.data);
                setTotalWorkflows(response.data.metadata.totalCount);
            } else {
                const dummyProcessData: any[] = [
                    { id: "1", name: "Process 1", type: "Type A", createdDate: "2024-01-01", lastModifiedDate: "2024-02-01", workflow: "Workflow A" },
                    { id: "2", name: "Process 2", type: "Type B", createdDate: "2024-01-02", lastModifiedDate: "2024-02-02", workflow: "Workflow B" },
                    { id: "3", name: "Process 3", type: "Type C", createdDate: "2024-01-03", lastModifiedDate: "2024-02-03", workflow: "Workflow C" },
                    { id: "4", name: "Process 4", type: "Type D", createdDate: "2024-01-04", lastModifiedDate: "2024-02-04", workflow: "Workflow D" },
                    { id: "5", name: "Process 5", type: "Type E", createdDate: "2024-01-05", lastModifiedDate: "2024-02-05", workflow: "Workflow E" },
                ];
                setProcessRows(dummyProcessData);
                setTotalProcesses(dummyProcessData.length);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(currentTab, page, rowsPerPage);
    }, [currentTab, page, rowsPerPage]);

    const deleteAllFunc = () => {
        setLoading(true);
        axios
            .delete(`http://20.191.97.36:8090/v1/${currentTab === "1" ? "workflow" : "process"}/all`, {
                data: {
                    ids: currentTab === "1" ? selectedWorkflow : selectedProcess,
                },
            })
            .then((response) => {
                console.log(response.data);
                setLoading(false);
                fetchData(currentTab, page, rowsPerPage);
            });
    };

    const handleRequestSort = (event: React.MouseEvent<HTMLElement>, property: keyof any) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (selected: boolean) => {
        if (selected) {
            const newSelecteds = (currentTab === "1" ? rows : processRows).map((n) => n.id);
            if (currentTab === "1") {
                setSelectedWorkflow([...newSelecteds]);
            } else {
                setSelectedProcess([...newSelecteds]);
            }
            return;
        }
        if (currentTab === "1") {
            setSelectedWorkflow([]);
        } else {
            setSelectedProcess([]);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
        event.stopPropagation();
        const selectedIndex = currentTab === "1" ? selectedWorkflow.indexOf(id) : selectedProcess.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(currentTab === "1" ? selectedWorkflow : selectedProcess, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(currentTab === "1" ? selectedWorkflow.slice(1) : selectedProcess.slice(1));
        } else if (selectedIndex === (currentTab === "1" ? selectedWorkflow : selectedProcess).length - 1) {
            newSelected = newSelected.concat(currentTab === "1" ? selectedWorkflow.slice(0, -1) : selectedProcess.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                currentTab === "1" ? selectedWorkflow.slice(0, selectedIndex) : selectedProcess.slice(0, selectedIndex),
                currentTab === "1" ? selectedWorkflow.slice(selectedIndex + 1) : selectedProcess.slice(selectedIndex + 1)
            );
        }
        if (currentTab === "1") {
            setSelectedWorkflow(newSelected);
        } else {
            setSelectedProcess(newSelected);
        }
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(1);
    };

    return (
        <Layout style={{ width: "100%" }}>
            <EnhancedTableToolbar
                numSelected={currentTab === "1" ? selectedWorkflow.length : selectedProcess.length}
                onDeleteAllFunc={deleteAllFunc}
                setCurrentTab={setCurrentTab}
                currentTab={currentTab}
            />
            <Content style={{ padding: "24px", minHeight: "100%", backgroundColor: "white" }}>
                <WorkflowTable
                    currentTab={currentTab}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                    rows={currentTab === "1" ? rows : processRows}
                    total={currentTab === "1" ? totalWorkflows : totalProcesses}
                    loading={loading}
                />
            </Content>
        </Layout>
    );
};

export default WorkflowList;
