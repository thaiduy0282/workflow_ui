import { Avatar, Flex, Image, Tabs, TabsProps, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { images } from "../../assets";
import { useNavbarItems } from "../../context/useNavbar";
import {
  BellOutlined,
  MoonOutlined,
  NotificationOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export const HeaderLayout = () => {
  const { navbarItems } = useNavbarItems();

  const user = "T";

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <Header className="layout__header">
      <div className="layout__header-container">
        <Flex justify="space-between">
          <Link to="/">
            <Image
              src={images.QWORKSLOGO}
              alt="qworks_logo"
              className="layout__header-logo"
              preview={false}
            />
          </Link>
          <Tabs defaultActiveKey="1" items={navbarItems} onChange={onChange} />
          <Flex className="layout__header-actions">
            <SearchOutlined />
            <MoonOutlined />
            <BellOutlined />
            <Avatar style={{ verticalAlign: "middle" }} size="large">
              {user}
            </Avatar>
          </Flex>
        </Flex>
      </div>
    </Header>
  );
};
