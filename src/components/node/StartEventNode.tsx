import "./style.css";

import { Col, Row, Typography } from "antd";
import { FC, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { images } from "../../assets";

const StartEventNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;

  const checkStartEventData = () => {
    return (
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
          props.data.label
        ) : (
          <Row style={{ width: "100%", height: "100%" }}>
            <Col span={4} className="image__container">
              <img src={images.QWORKS} className="image-app" />
            </Col>
            <Col span={20}>
              <div className="node__text">
                {data.eventTopic + " event from " + data.category}
              </div>
            </Col>
          </Row>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default StartEventNode;
