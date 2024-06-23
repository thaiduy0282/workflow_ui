import { Button, Layout, Menu, Row, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import ModalCreateWorkflow from "./components/modal/ModalCreateWorkflow";
import WorkflowTable from "./components/Table";
import axios from "axios";
import { handleGetWorkflow } from "./handleApi";
import { PageHeader } from "../../components/layout/PageHeader";

const { Content } = Layout;

const EnhancedTableToolbar: React.FC<{
  numSelected: number;
  onDeleteAllFunc: () => void;
  setCurrentTab: (key: string) => void;
  currentTab: string;
}> = ({ numSelected, onDeleteAllFunc, setCurrentTab, currentTab }) => {
  const deleteAllFunc = () => {
    onDeleteAllFunc();
  };

  return (
    <>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        onClick={(e) => setCurrentTab(e.key)}
        items={[
          { key: "1", label: "Workflow" },
          { key: "2", label: "Process" },
        ]}
        style={{ marginBottom: "10px" }}
      />
      <Row justify="end">
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} onClick={deleteAllFunc} />
          </Tooltip>
        ) : (
          currentTab === "1" && <ModalCreateWorkflow />
        )}
      </Row>
    </>
  );
};

const Home: React.FC = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof any>("type");
  const [selectedWorkflow, setSelectedWorkflow] = useState<readonly string[]>(
    []
  );
  const [selectedProcess, setSelectedProcess] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [processRows, setProcessRows] = useState<any[]>([]);
  const [totalProcesses, setTotalProcesses] = useState(0);
  const [currentTab, setCurrentTab] = useState("1");

  const { isLoading, data } = handleGetWorkflow(page, size);

  const dataTable = useMemo(() => {
    if (data?.data) {
      const results = data?.data;
      return results;
    } else {
      return [];
    }
  }, [data?.data]);

  let total: number = useMemo(() => {
    if (data?.data) {
      let totalTemp = data?.data?.total;
      return totalTemp;
    } else {
      return 0;
    }
  }, [data?.data]);

  const deleteAllFunc = () => {
    true;
    axios
      .delete(
        `http://20.191.97.36:8090/v1/${
          currentTab === "1" ? "workflow" : "process"
        }/all`,
        {
          data: {
            ids: currentTab === "1" ? selectedWorkflow : selectedProcess,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      });
  };

  return (
    <>
      <PageHeader
        title="Workflow"
        secondaryHeader
        extraAction={<ModalCreateWorkflow />}
      />
      {/* <EnhancedTableToolbar
        numSelected={
          currentTab === "1" ? selectedWorkflow.length : selectedProcess.length
        }
        onDeleteAllFunc={deleteAllFunc}
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
      /> */}
      <Content>
        <WorkflowTable
          currentTab={currentTab}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          rows={currentTab === "1" ? dataTable : processRows}
          total={currentTab === "1" ? total : totalProcesses}
          loading={isLoading}
        />
      </Content>
    </>
  );
};

export default Home;
