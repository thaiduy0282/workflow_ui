import { Breadcrumb, Flex, Input, Menu, Typography, theme } from "antd";
import { ReactNode, useState } from "react";
import { PrimaryButton } from "../button/PrimaryButton";
import {
  FilterOutlined,
  LeftOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import useToken from "antd/es/theme/useToken";

type Props = {
  title: string;
  breadcrumb?: ItemType[];
  extraAction: ReactNode;
  secondaryHeader?: boolean;
  onBack?: boolean;
};

const { Search } = Input;

export const PageHeader: React.FC<Props> = ({ ...props }) => {
  const { title, breadcrumb, extraAction, secondaryHeader, onBack } = props;

  const pathname = useParams();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [currentTab, setCurrentTab] = useState("1");

  const itemRender = (currentRoute: ItemType) => {
    return (
      <Link
        to={currentRoute?.href || pathname}
        style={{
          color: currentRoute?.href ? token.colorPrimary : token.colorText,
        }}
      >
        {currentRoute.title}
      </Link>
    );
  };
  return (
    <>
      {breadcrumb && <Breadcrumb itemRender={itemRender} items={breadcrumb} />}
      <Flex justify="space-between" className="layout__page-header">
        <Flex gap={5}>
          {onBack && (
            <PrimaryButton
              type="default"
              icon={<LeftOutlined />}
              onClick={() => navigate("/")}
            />
          )}
          <Typography.Title level={3} className="layout__page-header-title">
            {title}
          </Typography.Title>
        </Flex>
        {extraAction}
      </Flex>
      {secondaryHeader && (
        <Flex justify="space-between" className="layout__page-header-secondary">
          <Menu
            className="layout__page-header-secondary-menu"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            onClick={(e) => setCurrentTab(e.key)}
            items={[
              { key: "1", label: "Workflow" },
              { key: "2", label: "Process" },
            ]}
          />
          <Flex gap={5}>
            <PrimaryButton
              type="text"
              icon={<FilterOutlined />}
              text="Filter"
              onClick={() => {}}
            />
            <PrimaryButton
              type="text"
              icon={<ReloadOutlined />}
              text="Refresh"
              onClick={() => {}}
            />
            <Search
              className="layout__page-header-secondary-search"
              placeholder="Search somethings..."
              onSearch={() => {}}
              size="large"
            />
          </Flex>
        </Flex>
      )}
    </>
  );
};
