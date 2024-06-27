"use client";

import { Collapse as AntCollapse, CollapseProps } from "antd";
import React, { ReactNode } from "react";

import styled from "styled-components";

const StyledCollapse = styled(AntCollapse)`
  border: 1px solid #f0f0f0;
  .ant-collapse-header {
    border-radius: 8px 8px 0 0;
  }
  .ant-collapse-item-disabled .ant-collapse-header {
    color: #6161ff !important;
    background: #efefff !important;
    cursor: pointer;
  }
`;

const Collapse: React.FC<CollapseProps & { children?: ReactNode }> = ({
  children,
  ...props
}) => {
  return <StyledCollapse {...props}>{children}</StyledCollapse>;
};

export default Collapse;
