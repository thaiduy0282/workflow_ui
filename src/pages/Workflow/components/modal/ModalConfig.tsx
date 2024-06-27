import { Checkbox, CollapseProps, Flex, Form, Select, message } from "antd";
import Input, { TextArea } from "../../../../components/custom/Input";

import Button from "../../../../components/custom/Button";
import Collapse from "../../../../components/custom/Collapse";
import ModalLayout from "../../../../components/modal/ModalLayout";
import { PlusCircleOutlined } from "@ant-design/icons";
import { handleGetMetadata } from "../../../../components/metadata/handleAPI";
import { useForm } from "antd/es/form/Form";
import { useReactFlow } from "reactflow";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onCancel: () => any;
  currentNode: any;
};

const ModalConfig: React.FC<Props> = ({ ...props }) => {
  const { isOpen, onCancel, currentNode } = props;

  const { data }: any = handleGetMetadata();

  const [form] = useForm();
  const [collapseList, setCollapseList] = useState(["field-1"]);

  const { getNodes, setNodes } = useReactFlow();

  const addMoreCollapse = () => {
    const cloneList = collapseList;
    cloneList.push(`field-${collapseList.length + 1}`);
    setCollapseList(cloneList);
  };

  const onOk = async () => {
    onFinish();
    onCancel();
  };

  const formatValue = (data: any) => {
    let newData = JSON.parse(JSON.stringify(data));

    newData.fields = [];

    for (let key in newData) {
      if (key.startsWith("field-")) {
        const newDataKey = { ...newData[key] };
        newData.fields.push({
          field: JSON.parse(newDataKey.field),
          value: newDataKey.value,
        });
        delete newData[key];
      }
    }

    return newData;
  };

  const onFinish = () => {
    const currentformValues = { ...form.getFieldsValue() };
    if (currentNode.data.typeNode === "Action")
      setNodes(editNode(formatValue(currentformValues)));
    else setNodes(editNode(currentformValues));
    message.success("Submit success!");
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const editNode = (values: Object) => {
    return getNodes().map((nd: any) => {
      if (nd.id === currentNode.id) {
        nd.data = {
          ...nd.data,
          ...values,
        };
      }
      return nd;
    });
  };

  const getModalTitle = () => {
    switch (currentNode.data.typeNode) {
      case "If":
        return "If Setup";
      case "Action":
        return "Action Setup";
      case "Loop":
        return "Loop Setup";
      default:
        return "";
    }
  };

  return (
    <ModalLayout
      title={getModalTitle()}
      isOpen={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      // okButtonProps={{ disabled: true }}
      className="modal-config"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Flex vertical gap="middle">
          <Form.Item name="displayName" label="Display Name">
            <Input placeholder="Enter Display Name" />
          </Form.Item>
          {currentNode.data.typeNode === "If" && (
            <>
              <Form.Item name="formula" label="Formula">
                <TextArea placeholder="Write Condition" />
              </Form.Item>
              <Form.Item name="showSyntax" valuePropName="checked">
                <Checkbox defaultChecked={true}>Show syntax help</Checkbox>
              </Form.Item>
            </>
          )}
          {currentNode.data.typeNode === "Action" && (
            <>
              <Form.Item name="actionType" label="Action Type">
                <Select
                  placeholder="Select Action Type"
                  style={{ width: "100%" }}
                  options={[
                    {
                      value: "Update data",
                      label: "Update data",
                    },
                  ]}
                />
              </Form.Item>
              {collapseList.map((value) => (
                <Collapse
                  items={[
                    {
                      key: value,
                      label: "Field",
                      showArrow: false,
                      children: (
                        <>
                          <Form.Item name={[value, "field"]} label="Field">
                            <Select
                              placeholder="Field"
                              style={{ width: "100%" }}
                              options={data?.data?.fieldDefinitions.map(
                                (field: any) => {
                                  return {
                                    value: JSON.stringify(field),
                                    label: field.label,
                                  };
                                }
                              )}
                            />
                          </Form.Item>
                          <Form.Item name={[value, "value"]} label="Value">
                            <Input placeholder="Enter Value" />
                          </Form.Item>
                        </>
                      ),
                    },
                  ]}
                  key={`collapse-${value}`}
                  defaultActiveKey={[value]}
                  className="collapse__field"
                  collapsible="disabled"
                />
              ))}
            </>
          )}
          {currentNode.data.typeNode === "Loop" && (
            <>
              <Form.Item name="inputList" label="Input List">
                <Select
                  placeholder="Select Input List"
                  style={{ width: "100%" }}
                  options={[
                    {
                      value: "elements",
                      label: "Elements",
                    },
                  ]}
                />
              </Form.Item>
            </>
          )}
        </Flex>
      </Form>
      {currentNode.data.typeNode === "Action" && (
        <div className="btn-add-more-field">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => addMoreCollapse()}
            type="primary"
            ghost
          >
            Add another Field
          </Button>
        </div>
      )}
    </ModalLayout>
  );
};

export default ModalConfig;
