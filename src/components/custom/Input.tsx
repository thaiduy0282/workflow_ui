"use client";

import {
  Input as AntInput,
  InputNumber as AntInputNumber,
  Flex,
  InputNumberProps,
  InputProps,
  theme,
} from "antd";
import {
  CloseCircleFilled,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { PasswordProps, SearchProps, TextAreaProps } from "antd/es/input";
import React, { ReactNode } from "react";
import {
  inputDefaultShadow,
  inputErrorShadow,
  inputPrimaryShadow,
  inputWarningShadow,
} from "../../theme/shadows";

import { THEME } from "../../theme";
import { Text } from "./Typography";
import styled from "styled-components";

const shadowStyle = `
  border: none !important;
  box-shadow: ${inputDefaultShadow};

  &:hover,
  &:focus {
    box-shadow: ${inputPrimaryShadow};
  }

  &.warning,
  &.warning: hover, 
  &.warning: focus {
    box-shadow: ${inputWarningShadow};
  }

  &.error,
  &.error: hover, 
  &.error: focus {
    box-shadow: ${inputErrorShadow};
  }
`;

const StyledInput = styled(AntInput)`
  background-color: ${(props) =>
    props.theme.mode === THEME.DARK && "#FFFFFF0D"};
  ${shadowStyle};
`;
const StyledTextArea = styled(AntInput.TextArea)`
  ${shadowStyle}
  background-color: ${(props) =>
    props.theme.mode === THEME.DARK && "#FFFFFF0D"};
`;
const StyledInputPassword = styled(AntInput.Password)`
  ${shadowStyle}
  background-color: ${(props) =>
    props.theme.mode === THEME.DARK && "#FFFFFF0D"};
`;

// Input Component_______________________________________________________________
const Prefix: React.FC<{ icon?: ReactNode; prefix?: ReactNode }> = ({
  icon,
  prefix,
}) => {
  return (
    <Flex gap="12px" style={{ marginRight: "8px" }}>
      {icon && <Text level={3}>{icon}</Text>}
      {prefix && <Text level={2}>{prefix}</Text>}
    </Flex>
  );
};

const Suffix: React.FC<{ icon?: ReactNode; suffix?: ReactNode }> = ({
  icon,
  suffix,
}) => {
  return (
    <Flex gap="12px" style={{ marginLeft: "8px" }}>
      {icon}
      {suffix && <Text level={2}>{suffix}</Text>}
    </Flex>
  );
};

type InputCompProps = InputProps & {
  icon?: ReactNode;
};
const Input: React.FC<InputCompProps> = ({ icon, ...props }) => {
  const { token } = theme.useToken();
  const { prefix, suffix, status } = props;

  return (
    <StyledInput
      prefix={<Prefix icon={icon} prefix={prefix} />}
      suffix={
        <Suffix
          icon={
            status === "warning" ? (
              <ExclamationCircleFilled
                style={{ color: token.colorWarningText }}
              />
            ) : status === "error" ? (
              <CloseCircleFilled style={{ color: token.colorErrorText }} />
            ) : undefined
          }
          suffix={suffix}
        />
      }
      className={`${status}`}
      {...props}
      // value={inputValue}
    />
  );
};

// InputNuber Component_______________________________________________________________
const StyledInputNumber = styled(AntInputNumber)`
  ${shadowStyle}
  width: 100%;
  .ant-input-number-outlined {
    border: none;
    box-shadow: none;
    margin-left: 2px;
  }
`;
type InputNumberCompProps = InputNumberProps & {
  icon?: ReactNode;
};
export const InputNumber: React.FC<InputNumberCompProps> = ({
  icon,
  ...props
}) => {
  const { prefix, status, ...rest } = props;

  return (
    <StyledInputNumber
      {...rest}
      prefix={<Prefix icon={icon} prefix={prefix} />}
      className={`${status}`}
    />
  );
};

// TextArea Component_______________________________________________________________

export const TextArea: React.FC<TextAreaProps> = ({ ...props }) => {
  return <StyledTextArea {...props} />;
};

// Password Component_______________________________________________________________
export const InputPassword: React.FC<PasswordProps> = ({ ...props }) => {
  return <StyledInputPassword {...props} />;
};

// SearcjBox Component_______________________________________________________________
const StyledSearchBox = styled(AntInput.Search)`
  ${shadowStyle}

  background-color: ${(props) =>
    props.theme.mode === THEME.DARK && "#FFFFFF0D"};
  border-radius: 6px;
  transition: 0.3s;
  &:has(.ant-input:focus) {
    box-shadow: ${inputPrimaryShadow};
  }
  .ant-btn,
  .ant-input,
  .ant-input-affix-wrapper {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  .ant-btn {
    background: ${(props) => props.theme.antd?.colorFillQuaternary};
  }
`;
type SearchBoxProps = SearchProps & {
  prefix?: boolean;
  text?: boolean;
  voice?: boolean;
};

export const SearchBox: React.FC<SearchBoxProps> = ({
  prefix,
  voice,
  ...props
}) => {
  return (
    <StyledSearchBox
      {...props}
      addonBefore={prefix && "Https://"}
      suffix={
        voice && <SearchOutlined size={props.size === "small" ? 14 : 18} />
      }
    />
  );
};

export default Input;
