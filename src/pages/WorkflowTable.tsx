import React from "react";
import { Table, Spin, Pagination } from "antd";
import ActionCell from "./ActionCell";

const headCells = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate" },
    { title: "Last Modified", dataIndex: "lastModifiedDate", key: "lastModifiedDate" },
    { title: "Action", key: "action", render: (text: any, record: any) => <ActionCell record={record} currentTab="1" /> },
];

const processHeadCells = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Workflow", dataIndex: "workflow", key: "workflow" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate" },
    { title: "Last Modified", dataIndex: "lastModifiedDate", key: "lastModifiedDate" },
    { title: "Action", key: "action", render: (text: any, record: any) => <ActionCell record={record} currentTab="2" /> },
];

interface WorkflowTableProps {
    currentTab: string;
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (size: number) => void;
    rows: any[];
    total: number;
    loading: boolean;
}

const WorkflowTable: React.FC<WorkflowTableProps> = ({ currentTab, page, rowsPerPage, setPage, setRowsPerPage, rows, total, loading }) => {
    const handlePageChange = (newPage: number, pageSize?: number) => {
        setPage(newPage);
        if (pageSize && pageSize !== rowsPerPage) {
            setRowsPerPage(pageSize);
        }
    };

    return (
        <>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    rowKey="id"
                    columns={currentTab === "1" ? headCells : processHeadCells}
                    dataSource={rows}
                    pagination={false}
                />
            )}
            <Pagination
                current={page}
                pageSize={rowsPerPage}
                total={total}
                onChange={handlePageChange}
            />
        </>
    );
};

export default WorkflowTable;
