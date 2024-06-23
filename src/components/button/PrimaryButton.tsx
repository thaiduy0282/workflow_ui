import { Button } from "antd";
import { BaseButtonProps } from "antd/es/button/button";

type Props = {
  icon?: any;
  text?: string;
  type?: BaseButtonProps["type"];
  className?: string;
  onClick: () => any;
};

export const PrimaryButton: React.FC<Props> = ({
  icon,
  text,
  onClick,
  className,
  type,
}) => {
  return (
    <Button
      className={`btn-actions ${className}`}
      type={type ?? "primary"}
      icon={icon}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
