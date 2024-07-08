import "./style.css";

import {
  Checkbox,
  CheckboxProps,
  Flex,
  Form,
  Select,
  Tooltip,
  message,
} from "antd";
import { InfoCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import Button from "../../../../components/custom/Button";
import Collapse from "../../../../components/custom/Collapse";
import Input from "../../../../components/custom/Input";
import ModalLayout from "../../../../components/modal/ModalLayout";
import SelectFormula from "../select/SelectFormula";
import { handleGetMetadata } from "../../../../components/metadata/handleAPI";
import { useForm } from "antd/es/form/Form";
import { useReactFlow } from "reactflow";

type Props = {
  isOpen: boolean;
  onCancel: () => any;
  currentNode: any;
};

const ModalConfig: React.FC<Props> = ({ ...props }) => {
  const { isOpen, onCancel, currentNode } = props;

  const { data }: any = handleGetMetadata();

  const [form] = useForm();
  const [formula, setFormula] = useState<any>([]);
  const [collapseList, setCollapseList] = useState(["field-1"]);
  const [isShowSyntax, setShowSyntax] = useState(false);
  const { getNodes, setNodes } = useReactFlow();

  useEffect(() => {
    const { data } = currentNode;
    form.setFieldValue("displayName", data.displayName);
    switch (data.typeNode) {
      case "If":
        setFormula(data.formula ? data.formula : formula);
        setShowSyntax(data.showSyntax ? data.showSyntax : isShowSyntax);
        break;
      case "Action":
        let fieldsArray: any = [];
        data.fields?.forEach((field: any, index: any) => {
          fieldsArray.push({ [`field-${index + 1}`]: field });
        });

        fieldsArray.map((field: any) => {
          Object.keys(field).map((key: string) => {
            form.setFieldValue(key, field[key]);
          });
        });
        break;
    }
    form.setFieldsValue(data);
  }, [isOpen]);

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

  const formatFormula = () => {
    let referenceObjects: any = [];
    let formulaItems: any = [];
    const collectFormula = JSON.parse(JSON.stringify(formula)).map(
      (item: any) =>
        typeof item === "string" ? item : item.value?.split("#")[1] || item
    );

    let formulaItem: any = {};
    formula.forEach((item: any, index: any) => {
      if (typeof item === "string") {
        if (item === ")") {
          formulaItems.push(formulaItem);
          formulaItem = {};
        } else {
          formulaItem.comparisonValue = item;
        }
      } else if (item.value !== "(") {
        if (item?.value?.split("#").length === 1) {
          if (item.value === ")") {
            formulaItems.push(formulaItem);
            formulaItem = {};
          } else {
            formulaItem.comparisonValue = item.value;
          }
        } else {
          if (item?.value?.split("#")[0] === "metadata") {
            formulaItem.expression = item.label;
          } else if (item?.value?.split("#")[0] === "operator") {
            formulaItem.condition = item.label;
          } else if (item?.value?.split("#")[0] === "next") {
            formulaItems.push(formulaItem);
            formulaItem = {};
          }
        }
      }
      if (
        index === formula.length - 1 &&
        Object.keys(formulaItem).length != 0
      ) {
        formulaItems.push(formulaItem);
        formulaItem = {};
      }
    });

    function isJsonString(str: string) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    const expression = collectFormula
      .map((item: any) => {
        if (isJsonString(item)) {
          referenceObjects.push(JSON.parse(item));
          return JSON.parse(item).apiName;
        } else {
          return item;
        }
      })
      .join(" ");

    return { formula, formulaItems, expression, referenceObjects };
  };

  const onFinish = () => {
    const currentformValues = { ...form.getFieldsValue() };
    if (currentNode.data.typeNode === "Action")
      setNodes(editNode(formatValue(currentformValues)));
    else if (currentNode.data.typeNode === "If") {
      setNodes(
        editNode({
          displayName: currentformValues.displayName,
          showSyntax: currentformValues.showSyntax,
          ...formatFormula(),
        })
      );
    } else setNodes(editNode(currentformValues));
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

  const onChangeCheckbox: CheckboxProps["onChange"] = (e) => {
    setShowSyntax(e.target.checked);
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
                <SelectFormula formula={formula} setFormula={setFormula} />
                <Tooltip
                  className="tooltip__syntax"
                  color="blue"
                  title={
                    <>
                      <div>
                        Syntax: <b>Field - Operator - Value + Keyword</b>
                      </div>
                      <div>
                        <b>Field</b> – Different types of information include
                        accounttype, accountid, etc.
                      </div>
                      <div>
                        <b>Operator</b>
                        {
                          " – Are the heart of the query include equals (==), not equals (!=), less than (<), etc."
                        }
                      </div>
                      <div>
                        <b>Value</b> – Are the actual data in the query.
                      </div>
                      <div>
                        <b>Keyword</b> – AND, OR.
                      </div>
                      <div>
                        <b>Example</b>: (Accounttype == Admin) OR (Accountid ==
                        2016)
                      </div>
                    </>
                  }
                >
                  <InfoCircleOutlined
                    style={{ display: isShowSyntax ? "block" : "none" }}
                    className="icon__info"
                  />
                </Tooltip>
              </Form.Item>
              <Form.Item name="showSyntax" valuePropName="checked">
                <Checkbox onChange={onChangeCheckbox}>
                  Show syntax help
                </Checkbox>
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
