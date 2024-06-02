import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Tooltip,
    Typography,
    Spin,
    Layout,
    Switch,
    Row,
    Col,
    Pagination,
    Form
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const { Header, Content } = Layout;

interface Data {
    id: string;
    name: string;
    type: string;
    createdDate: string;
    lastModifiedDate: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: "asc" | "desc",
    orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate" },
    { title: "Last Modified", dataIndex: "lastModifiedDate", key: "lastModifiedDate" },
    { title: "Action", key: "action", render: (text: any, record: Data) => <ActionCell record={record} /> },
];

interface ActionCellProps {
    record: Data;
}

const ActionCell: React.FC<ActionCellProps> = ({ record }) => {
    const deleteFunc = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        axios
            .delete(`http://20.191.97.36:8090/v1/workflow/${record.id}`)
            .then((response) => {
                console.log(response.data);
                window.location.reload();
            });
    };

    return (
        <span>
      <RouterLink to={`/detail/${record.id}`}>
        <EditOutlined style={{ marginRight: 16 }} />
      </RouterLink>
      <Tooltip title="Delete">
        <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={(event) => deleteFunc(event)}
        />
      </Tooltip>
    </span>
    );
};

const EnhancedTableToolbar: React.FC<{ numSelected: number; onDeleteAllFunc: () => void }> = ({
                                                                                                  numSelected,
                                                                                                  onDeleteAllFunc,
                                                                                              }) => {
    const deleteAllFunc = () => {
        onDeleteAllFunc();
    };

    return (
        <Header style={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
            {numSelected > 0 ? (
                <Typography.Text>{numSelected} selected</Typography.Text>
            ) : (
                <Typography.Title level={4}>Workflow List</Typography.Title>
            )}
            <div>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <Button
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={deleteAllFunc}
                        />
                    </Tooltip>
                ) : (
                    <Row gutter={16}>
                        <Col>
                            <RouterLink to="/create">
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Create
                                </Button>
                            </RouterLink>
                        </Col>
                        <Col>
                            <Button icon={<UploadOutlined />}>Import XML File</Button>
                        </Col>
                    </Row>
                )}
            </div>
        </Header>
    );
};

const WorkflowList: React.FC = () => {
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof Data>("type");
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState<Data[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("http://20.191.97.36:8090/v1/workflow").then((response) => {
            console.log(response.data.data);
            setRows(response.data.data);
            setOrderBy("name");
        });
    }, [loading]);

    const deleteAllFunc = () => {
        setLoading(true);
        axios
            .delete(`http://20.191.97.36:8090/v1/workflow/all`, {
                data: {
                    ids: selected,
                },
            })
            .then((response) => {
                console.log(response.data);
                setLoading(false);
                window.location.reload();
            });
    };

    const handleRequestSort = (
        event: React.MouseEvent<HTMLElement>,
        property: keyof Data
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (selected: boolean) => {
        if (selected) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected([...newSelecteds]);  // Use spread operator to make the array mutable
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
        event.stopPropagation();
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected([...newSelected]);  // Use spread operator to make the array mutable
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleChangeDense = (checked: boolean) => {
        setDense(checked);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, rows]
    );

    return (
        <Layout style={{ width: "100%" }}>
            <EnhancedTableToolbar
                numSelected={selected.length}
                onDeleteAllFunc={deleteAllFunc}
            />
            <Content style={{ padding: "24px", minHeight: "100%" }}>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Table
                        rowSelection={{
                            selectedRowKeys: [...selected],  // Use spread operator to make the array mutable
                            onChange: (selectedRowKeys) => setSelected([...selectedRowKeys as string[]]),
                            onSelectAll: (selected, selectedRows, changeRows) => handleSelectAllClick(selected),
                        }}
                        columns={headCells}
                        dataSource={visibleRows}
                        pagination={false}
                        onChange={(pagination, filters, sorter) => {
                            if (!Array.isArray(sorter)) {
                                handleRequestSort(null as any, sorter.field as keyof Data);
                            }
                        }}
                    />
                )}
                <Pagination
                    total={rows.length}
                    pageSize={rowsPerPage}
                    current={page + 1}
                    onChange={(page, pageSize) => {
                        handleChangePage(page - 1);
                        handleChangeRowsPerPage(pageSize);
                    }}
                />
                <Form.Item label="Dense padding" valuePropName="checked">
                    <Switch checked={dense} onChange={(checked) => handleChangeDense(checked)} />
                </Form.Item>
            </Content>
        </Layout>
    );
};

export default WorkflowList;
