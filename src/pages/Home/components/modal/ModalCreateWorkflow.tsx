import { Modal, Radio, RadioChangeEvent, Typography } from "antd";

import CustomInput from "../../../../components/input/CustomInput";
import { PlusOutlined } from "@ant-design/icons";
import { PrimaryButton } from "../../../../components/button/PrimaryButton";
import { Title } from "../../../../components/custom/Typography";
import { handleCreateWorkflow } from "../../handleApi";
import handleNotificationMessege from "../../../../utils/notification";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const options = [
  { label: "By event", value: "E" },
  { label: "By scheduler", value: "S" },
  { label: "By manual", value: "M" }
];

const ModalCreateWorkflow = () => {
  const [value, setValue] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [folder, setFolder] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

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

  const onSuccess = (workflowId: string) => {
    handleNotificationMessege("Create workflow successfully!");
    clearInput();
    setIsModalOpen(false);
    navigate(`/workflow/${workflowId}/detail`);
  };

  const { isPending, mutate, isSuccess } = handleCreateWorkflow(onSuccess);

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
      <PrimaryButton
        className="btn-create-workflow"
        icon={<PlusOutlined />}
        text="Workflow"
        onClick={showModalCreateWorkflow}
      />
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
        <Title level={5}>Trigger Type</Title>
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
