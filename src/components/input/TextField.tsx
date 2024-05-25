import { TextField as TextFieldMUI, TextFieldProps } from "@mui/material";

import FullFormInput from "./FullFormInput";
import { forwardRef } from "react";

const TextField = forwardRef(({ label, ...props }: TextFieldProps, ref) => {
  return (
    <FullFormInput
      {...props}
      label={label}
      Input={TextFieldMUI}
      ref={ref as any}
    />
  );
});

export default TextField;
