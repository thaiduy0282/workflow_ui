"use client";

import { Button as AntButton, ButtonProps } from "antd";
import React, { ReactNode } from "react";

import { THEME } from "../../theme";
import styled from "styled-components";

const Wrapper = styled("div")`
  display: inline-block;
  border-radius: 8px;
  transition: 0.2s;
  border: 4px solid transparent;
`;

const StyledButton = styled(AntButton)`
  background: ${(props) =>
    props.theme.mode === THEME.DARK && "rgba(255, 255, 255, 0.15)"};
`;

const Button: React.FC<ButtonProps & { children?: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <Wrapper>
      <StyledButton {...props}>{children}</StyledButton>
    </Wrapper>
  );
};

export default Button;
