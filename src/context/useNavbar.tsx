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
      label: "Users",
      key: "users",
      children: [],
    },
  ];
  return { navbarItems };
};
