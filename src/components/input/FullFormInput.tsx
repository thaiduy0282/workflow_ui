import { ComponentType, forwardRef } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  SelectProps,
  TextFieldProps,
  ThemeProvider,
  Typography,
} from "@mui/material";

import { theme } from "../../themes/Theme";

function FullFormInput<P extends TextFieldProps & SelectProps>(
  {
    id,
    label,
    Input,
    required,
    ...props
  }:
    | ({ Input: ComponentType<P> } & TextFieldProps)
    | ({ Input: ComponentType<P> } & SelectProps & {
          helperText?: string | undefined;
        }),
  ref: any
) {
  return (
    <ThemeProvider theme={theme}>
      <FormControl
        fullWidth
        sx={{
          ".MuiFormControl-root": {
            mb: 0,
          },
          ".MuiInputBase-multiline": {
            padding: "0.5rem 1rem",
            textarea: {
              padding: "0",
            },
          },
        }}
      >
        <InputLabel
          htmlFor={id}
          sx={{
            lineHeight: "20px",
            py: "0.5rem",
            "&.Mui-focused": {
              color: "initial",
            },
            position: "unset",
            transform: "unset",
            color: "var(--text-primary)",
          }}
        >
          <Typography variant="label3">
            {label} {required && <span className="star-require"> *</span>}
          </Typography>
        </InputLabel>
        <Input
          id={id}
          label={undefined}
          ref={ref as any}
          {...(props as P)}
          helperText={undefined}
          inputProps={{
            style: {
              fontSize: "14px",
            },
          }}
        />
        <FormHelperText error={props.error} sx={{ ml: 0 }}>
          {props.helperText}
        </FormHelperText>
      </FormControl>
    </ThemeProvider>
  );
}

export default forwardRef(FullFormInput);
