import "./style.css";

import { Modal } from "antd";

type Props = {
  title: string;
  okText?: string;
  isOpen: boolean;
  onOk: () => any;
  onCancel: () => any;
  children: React.ReactNode;
  okButtonProps?: any;
  className?: string;
};

const ModalLayout: React.FC<Props> = ({ ...props }) => {
  const {
    title,
    isOpen,
    onOk,
    onCancel,
    className,
    children,
    okText = "Ok",
    okButtonProps,
  } = props;
  return (
    <Modal
      className={`modal__layout ${className}`}
      title={title}
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      okButtonProps={okButtonProps}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default ModalLayout;
