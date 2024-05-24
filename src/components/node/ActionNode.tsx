import { Box, Typography } from "@mui/material";

import { FC } from "react";
import { NodeProps } from "reactflow";

const containerStyle = {
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  alignItems: "center",
  width: 100,
  height: 110,
  gap: 2,
  padding: "10px 0px",
  borderRadius: "5px",
};

const borderStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px dashed",
  borderRadius: "10px",
  width: 50,
  height: 50,
};

const iconStyle = {
  fontSize: 50,
};

const labelStyle = {
  width: "100%",
  lineHeight: "20px",
  textAlign: "center",
};

const ActionNode: FC<NodeProps> = ({ data }) => {
  return (
    <Box sx={containerStyle} className="action-nodes">
      <div style={borderStyle}>
        <span style={iconStyle}>+</span>
      </div>
      <Typography variant="h6" sx={labelStyle}>
        {data.label}
      </Typography>
    </Box>
  );
};

export default ActionNode;
