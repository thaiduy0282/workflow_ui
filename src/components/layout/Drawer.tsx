import "./style.css";

import { Drawer, Select, Space } from "antd";

const DrawerLayout = ({ open, close, currentNode }: any) => {
  return (
    <>
      <Drawer
        title={
          <div style={{ textAlign: "center" }}>
            {currentNode?.data?.label} Setup
          </div>
        }
        placement="right"
        width={500}
        onClose={close}
        open={open}
        closeIcon={false}
      >
        {currentNode?.id === "trigger" ? (
          <Space direction="vertical" style={{ width: "100%", gap: "10px" }}>
            <Select
              defaultValue="Category"
              style={{ width: "100%", height: "40px" }}
              // onChange={handleChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "yiminghe" },
              ]}
            />
            <Select
              defaultValue="Folder"
              style={{ width: "100%", height: "40px" }}
              // onChange={handleChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "yiminghe" },
              ]}
            />
          </Space>
        ) : (
          <></>
        )}
      </Drawer>
    </>
  );
};

export default DrawerLayout;
