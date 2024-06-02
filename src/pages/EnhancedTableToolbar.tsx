import React from "react";
import { Button, Tooltip, Row, Menu } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom";

interface EnhancedTableToolbarProps {
    numSelected: number;
    onDeleteAllFunc: () => void;
    setCurrentTab: (key: string) => void;
    currentTab: string;
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({ numSelected, onDeleteAllFunc, setCurrentTab, currentTab }) => {
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
                style={{ marginBottom: '10px' }}
            />
            <Row justify="end" style={{ padding: '0 24px' }}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <Button
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={deleteAllFunc}
                        />
                    </Tooltip>
                ) : (
                    currentTab === "1" && (
                        <RouterLink to="/create">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ marginBottom: '10px' }}
                            >
                                Create
                            </Button>
                        </RouterLink>
                    )
                )}
            </Row>
        </div>
    );
};

export default EnhancedTableToolbar;
