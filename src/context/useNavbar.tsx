import { TabsProps } from "antd";

export const useNavbarItems = () => {
  const navbarItems: TabsProps["items"] = [
    {
      label: "Dashboard",
      key: "dashboard",
      children: [],
    },
    {
      label: "Workflows",
      key: "worflows",
      children: [],
    },
    {
      label: "User",
      key: "customer-consultation",
      children: [],
    },
  ];
  return { navbarItems };
};
