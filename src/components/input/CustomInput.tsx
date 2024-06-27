import "./style.css";

import { Input } from "antd";
import { Title } from "../custom/Typography";

type TProps = {
  value?: string;
  name?: string;
  label?: string;
  isRequired?: boolean;
  classNameContainer?: string;
  isError?: boolean;
  messageComponent?: any;
  typeInput?: string;
  placeholder?: string;
  onChange?: any;
};

const CustomInput = (props: TProps) => {
  const {
    value,
    name,
    label,
    classNameContainer,
    isRequired = false,
    isError,
    messageComponent,
    placeholder,
    onChange,
    ...rest
  } = props;
  return (
    <>
      <Title level={5}>
        {label} {isRequired && <span className="is-required">*</span>}
      </Title>
      <Input
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export default CustomInput;
