import "./style.css";

import { Col, Row, Space, Typography } from "antd";
import { FC, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { images } from "../../../../../assets";

const StartEventNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;

  const checkStartEventData = () => {
    return (
      data.typeNode === "StartEvent" &&
      data.category !== undefined &&
      data.provider !== undefined &&
      data.eventTopic !== undefined
    );
  };

  useEffect(() => {
    props.setDisableAddAction(!checkStartEventData());
  }, [data]);

  return (
    <>
      {checkStartEventData() && <div className="trigger-title">TRIGGER</div>}
      <div
        className={`node__container${
          checkStartEventData() ? " trigger-has-data" : ""
        }`}
      >
        {!checkStartEventData() ? (
          <Typography.Text className="node-text">
            {props.data.label}
          </Typography.Text>
        ) : (
          <Space className="node__space-trigger">
            <img src={images.QWORKS} className="image-app" />
            <Space direction="vertical" style={{ gap: "0px" }}>
              <Typography.Text className="node-text">
                {data.category}
              </Typography.Text>
              <Typography.Text className="node-description">
                {data.eventTopic}
              </Typography.Text>
            </Space>
          </Space>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default StartEventNode;
