import { Flex, Tag, Tooltip, theme } from "antd";

const TagComponent = ({ data }: any) => {
  const { token }: any = theme.useToken();
  switch (data.typeNode) {
    case "ConditionSetup":
      return (
        <Tooltip
          title={
            <>
              <span>{data.expression}</span>
              <span style={{ color: token.colorPink }}>{data.condition}</span>
              <span style={{ color: token.colorPrimary }}>
                {data.comparisonValue}
              </span>
            </>
          }
          placement="bottom"
        >
          <Tag style={{ width: "fit-content" }}>
            <Flex gap={5}>
              <span>{data.expression}</span>
              <span style={{ color: token.colorPink }}>{data.condition}</span>
              <span className="truncate" style={{ color: token.colorPrimary }}>
                {data.comparisonValue}
              </span>
            </Flex>
          </Tag>
        </Tooltip>
      );
    case "Action":
      return data.fields.map((item: any) => (
        <Tooltip
          title={
            <>
              <span>{data.actionType}: </span>
              <span style={{ color: token.colorPink }}>
                {item.field.label}{" "}
              </span>
              <span style={{ color: token.colorPrimary }}>{item.value}</span>
            </>
          }
          placement="bottom"
        >
          <Tag style={{ width: "fit-content" }}>
            <Flex gap={5}>
              <span>{data.actionType}: </span>
              <span style={{ color: token.colorPink }}>{item.field.label}</span>
              <span className="truncate" style={{ color: token.colorPrimary }}>
                {item.value}
              </span>
            </Flex>
          </Tag>
        </Tooltip>
      ));
  }
};

export default TagComponent;
