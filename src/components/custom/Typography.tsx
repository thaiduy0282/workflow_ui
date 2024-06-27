"use client";

import { LinkProps } from "antd/es/typography/Link";
import React from "react";
import { THEME } from "../../theme";
import { TextProps } from "antd/es/typography/Text";
import { TitleProps } from "antd/es/typography/Title";
import { Typography } from "antd";
import styled from "styled-components";

// Title Component_______________________________________________________________
export const Title: React.FC<TitleProps & { children: React.ReactNode }> = ({
  children,
  style,
  ...props
}) => {
  return (
    <Typography.Title
      style={{
        ...(props.level
          ? {}
          : { fontSize: "16px", lineHeight: "150%", fontWeight: 400 }),
        ...style,
      }}
      {...props}
    >
      {children}
    </Typography.Title>
  );
};

// Text Component_______________________________________________________________
const StyledText = styled(Typography.Text)`
  color: ${(props: any) =>
    props.theme.mode === THEME.DARK ? "white" : "inherit"};

  &.level-1,
  &.code {
    font-size: 12px;
    line-height: 166.667%;
    // font-weight: 700;
  }
  &.level-2 {
    font-size: 14px;
    // line-height: 157.143%;
  }
  &.level-3 {
    font-size: 16px;
    line-height: 150%;
  }
  &.level-4 {
    font-size: 20px;
    line-height: 140%;
  }

  &.mark > mark {
    background-color: #ffd533;
  }
`;

export const Text: React.FC<
  TextProps & { children: React.ReactNode; level?: 1 | 2 | 3 | 4 }
> = ({ children, level, ...props }) => {
  return (
    <StyledText
      className={`level-${level} ${props.mark && "mark"} ${
        props.code && "code"
      }`}
      {...props}
    >
      {children}
    </StyledText>
  );
};

// Link Component_______________________________________________________________
export const Link: React.FC<LinkProps & { children: React.ReactNode }> = ({
  children,
  ...props
}) => {
  return <Typography.Link {...props}>{children}</Typography.Link>;
};
