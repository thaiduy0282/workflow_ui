import "./style.css";

import { Button, Modal, Radio, RadioChangeEvent, Typography } from "antd";

import CustomInput from "../../../../components/input/CustomInput";
import { PlusOutlined } from "@ant-design/icons";
import { handleCreateWorkflow } from "../../handleApi";
import { useState } from "react";

const options = [
  { label: "By event", value: "E" },
  { label: "By scheduler", value: "S" },
  { label: "By manual", value: "M" },
  { label: "By ...", value: "..." },
];

const ModalCreateWorkflow = () => {
  const [value, setValue] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [folder, setFolder] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModalCreateWorkflow = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    clearInput();
    setIsModalOpen(false);
  };

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };

  const { isPending, mutate, isSuccess } = handleCreateWorkflow(handleCancel);

  const handleOk = () => {
    const data = {
      name: workflowName,
      type: "VALIDATION",
      folder,
    };
    mutate(data);
  };

  const clearInput = () => {
    setWorkflowName("");
    setFolder("");
    setValue("");
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: "10px" }}
        onClick={() => showModalCreateWorkflow()}
      >
        Create
      </Button>
      <Modal
        title="Create Workflow"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CustomInput
          label="Workflow Name"
          name="workflow"
          placeholder="Workflow name"
          value={workflowName}
          onChange={setWorkflowName}
        />
        <CustomInput
          label="Folder"
          name="folder"
          placeholder="Folder"
          value={folder}
          onChange={setFolder}
        />
        <Typography.Title level={5}>Trigger Type</Typography.Title>
        <Radio.Group
          options={options}
          onChange={onChange}
          value={value}
          optionType="button"
          size="large"
        />
      </Modal>
    </>
  );
};

export default ModalCreateWorkflow;
