import { Button, Dropdown } from "antd";

import { EllipsisOutlined } from "@ant-design/icons";

type Props = {
  items: any;
};

export const DropdownNode: React.FC<Props> = ({ ...props }) => {
  const { items } = props;
  return (
    <Dropdown
      menu={{ items }}
      className="dropdown__edit-node"
      placement="bottomRight"
    >
      <Button icon={<EllipsisOutlined style={{ fontSize: "8px" }} />} />
    </Dropdown>
  );
};
