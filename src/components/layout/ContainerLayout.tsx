import { Layout } from "antd";

export const ContainerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Layout className="layout__container">
      <Layout className="layout__container-child">{children}</Layout>
    </Layout>
  );
};
