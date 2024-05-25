import { Box, FormControl, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { HTMLInputTypeAttribute } from "react";
import { Warning } from "@mui/icons-material";

interface Props {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorMessage?: string;
  require?: boolean;
  validate?: (value: string) => string | undefined; // Custom validation function
  inputProps?: any;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
}

const InputCustom: React.FC<Props> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  require = true,
  errorMessage,
  validate,
  multiline = false,
  rows = undefined,
  inputProps = {},
  disabled = false,
  type = "text",
}) => {
  const [error, setError] = useState<any | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Custom validation
    let customError = validate ? validate(inputValue) : undefined;

    // Default validation
    if (!inputValue && require) {
      customError = `Vui lòng nhập ${label.toLowerCase()}`;
    }
    setError(customError);

    // Pass control to parent component
    onChange(e);
  };

  return (
    <FormControl variant="standard" fullWidth>
      <Typography marginLeft="3px" variant="label3" sx={{ textAlign: "left" }}>
        {label}
        {require && <span className="star-require"> *</span>}{" "}
      </Typography>
      <Box padding="4px">
        <TextField
          required={require}
          disabled={disabled}
          fullWidth
          name={name}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          error={!!(errorMessage || error)}
          helperText={
            (errorMessage || error) && (
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <Warning /> {errorMessage || error}
              </div>
            )
          }
          sx={{
            "& .MuiInputBase-root": {
              "&.MuiOutlinedInput-root input": {
                fontSize: "14px",
                "&::placeholder": {
                  fontSize: "14px",
                },
              },
            },
          }}
          inputProps={inputProps}
          multiline={multiline}
          rows={rows}
          type={type}
        />
      </Box>
    </FormControl>
  );
};

export default InputCustom;
