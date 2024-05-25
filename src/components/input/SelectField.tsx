import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";

import React from "react";
import { SelectChangeEvent } from "@mui/material/Select";

interface Props {
  name: string;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void; // Adjusted type
  options: { id: string; name: string }[];
  placeholder?: string;
  error?: string;
}

const SelectField: React.FC<Props> = ({
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}) => {
  return (
    <FormControl fullWidth>
      <Typography
        marginLeft="3px"
        variant="label3"
        className="custom-select-title"
      >
        {label}
        <span className="star-require"> *</span>{" "}
      </Typography>
      <Box padding="4px" className="custom-select-box">
        <Select
          name={name}
          value={value}
          onChange={onChange}
          displayEmpty
          error={!!error}
          placeholder={placeholder}
          sx={{ fontSize: "14px" }}
        >
          <MenuItem value="" style={{ display: "none" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                color="#c5c8c8"
                sx={{ fontSize: "14px" }}
              >
                {placeholder}
              </Typography>
            </Box>
          </MenuItem>
          {options.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              sx={{ fontSize: "14px", minHeight: "40px" }}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </FormControl>
  );
};

export default SelectField;
