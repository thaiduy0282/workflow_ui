import { Form, Select, message } from "antd";

import ModalLayout from "../../../../components/modal/ModalLayout";
import { useForm } from "antd/es/form/Form";
import { useReactFlow } from "reactflow";

type Props = {
  isOpen: boolean;
  onCancel: () => any;
  currentNode: any;
};
const ModalTrigger: React.FC<Props> = ({ ...props }) => {
  const { isOpen, onCancel, currentNode } = props;
  const { getNodes, setNodes } = useReactFlow();

  const [form] = useForm();

  const onOk = async () => {
    onFinish();
    onCancel();
  };

  const onFinish = () => {
    const currentformValues = { ...form.getFieldsValue() };
    setNodes(editNode(currentformValues));
    message.success("Submit success!");
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const editNode = (values: Object) => {
    return getNodes().map((nd: any) => {
      if (
        nd.data.typeNode === "StartEvent" &&
        nd.id === currentNode.id &&
        currentNode.data.typeNode === "StartEvent"
      ) {
        nd.data = {
          ...nd.data,
          ...values,
          provider: "AKKA",
        };
      }
      return nd;
    });
  };

  return (
    <ModalLayout
      title="Trigger Setup"
      isOpen={isOpen}
      okText="Save"
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Category"
            style={{ width: "100%", height: "40px" }}
            options={[{ value: "QWORKS", label: "QWORKS" }]}
          />
        </Form.Item>
        <Form.Item name="eventTopic" label="Event" rules={[{ required: true }]}>
          <Select
            placeholder="Event"
            style={{ width: "100%", height: "40px" }}
            options={[{ value: "ACCOUNT_EVENT", label: "ACCOUNT_EVENT" }]}
          />
        </Form.Item>
      </Form>
    </ModalLayout>
  );
};

export default ModalTrigger;
