import React from "react";
import { Button, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, ThunderboltOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

interface ActionCellProps {
    record: any;
    currentTab: string;
}

const ActionCell: React.FC<ActionCellProps> = ({ record, currentTab }) => {
    const deleteFunc = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        axios
            .delete(`http://20.191.97.36:8090/v1/${currentTab === "1" ? "workflow" : "process"}/${record.id}`)
            .then((response) => {
                console.log(response.data);
                window.location.reload();
            });
    };

    const triggerFunc = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        console.log(`Triggered action for record ID: ${record.id}`);
    };

    return (
        <span>
            {currentTab === "1" ? (
                <>
                    <Link to={`/detail/${record.id}`}>
                        <EditOutlined style={{ marginRight: 16 }} />
                    </Link>
                    <Tooltip title="Delete">
                        <Button type="text" icon={<DeleteOutlined />} onClick={(event) => deleteFunc(event)} />
                    </Tooltip>
                </>
            ) : (
                <Tooltip title="Trigger">
                    <Button type="text" icon={<ThunderboltOutlined />} onClick={(event) => triggerFunc(event)} />
                </Tooltip>
            )}
        </span>
    );
};

export default ActionCell;
