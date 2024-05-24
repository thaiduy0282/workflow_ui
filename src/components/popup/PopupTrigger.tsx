import * as React from "react";

import {
  Box,
  Chip,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

import Button from "@mui/material/Button";
import { CheckCircleOutline } from "@mui/icons-material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Points } from "../../constant/Points";

export default function PopupTrigger({ open, handleClose }: any) {
  const [folder, setFolder] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setFolder(event.target.value as string);
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Setup your recipe"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} marginTop={1}>
            <FormControl fullWidth>
              <TextField id="outlined-basic" label="Name" variant="outlined" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Create in folder
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={folder}
                label="Create in folder"
                onChange={handleChange}
              >
                <MenuItem value="a">Home</MenuItem>
                <MenuItem value="b">House</MenuItem>
                <MenuItem value="c">Floor</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Pick a starting point
              </FormLabel>
              <RadioGroup row name="row-radio-buttons-group">
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                  {Points.map((data, index) => (
                    <Grid item xs={2} sm={4} md={6} key={index}>
                      <FormControlLabel
                        value={data.key}
                        control={<Radio />}
                        label={
                          <Chip
                            // icon={icon}
                            label={data.label}
                          />
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Start Building
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
