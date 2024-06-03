import { Button, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import { handleDeleteWorkflow } from "../handleApi";

interface ActionCellProps {
  record: any;
  currentTab: string;
}

const ActionCell: React.FC<ActionCellProps> = ({ record, currentTab }) => {
  const { isPending, mutate, isSuccess } = handleDeleteWorkflow(record.id);
  const handleDelete = () => {
    mutate();
  };

  const triggerFunc = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log(`Triggered action for record ID: ${record.id}`);
  };

  return (
    <span>
      {currentTab === "1" ? (
        <>
          <Link to={`/workflow/${record.id}/detail`}>
            <EditOutlined style={{ marginRight: 16 }} />
          </Link>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            />
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Trigger">
          <Button
            type="text"
            icon={<ThunderboltOutlined />}
            onClick={(event) => triggerFunc(event)}
          />
        </Tooltip>
      )}
    </span>
  );
};

export default ActionCell;
