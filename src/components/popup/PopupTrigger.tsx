import * as React from "react";

import {
  Box,
  Chip,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  SelectChangeEvent,
} from "@mui/material";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Points } from "../../constant/Points";
import SelectField from "../input/SelectField";
import TextField from "../input/TextField";

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
            <TextField
              id="name"
              label="Name"
              required
              // label={allocateTranslate('license-plates')}
              // error={!!getError('licensePlate')}
              // helperText={getError('licensePlate')?.message}
              // placeholder={allocateTranslate(
              //   'license-plates-placeholder'
              // )}
              // {...register('licensePlate', {
              //   required: generateValidationRule(
              //     true,
              //     allocateTranslate('license-plates-error-message')
              //   ),
              //   pattern: generateValidationRule(
              //     EMPTY_STRING_REGEX,
              //     allocateTranslate('license-plates-format-error')
              //   ),
              // })}
            />
            <SelectField
              name="folder"
              label="Folder"
              value="Folder"
              onChange={(event: SelectChangeEvent<string>) => {
                // handleInputChange(event);
                // setFormErrors((prev: any) => ({
                //   ...(prev || {}),
                //   [event.target.name]: event.target.value
                //     ? undefined
                //     : t('folder-placeholder'),
                // }));
              }}
              options={[]}
              placeholder="Folder"
              // error={formErrors?.folder}
            />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Pick a starting point
              </FormLabel>
              <RadioGroup row name="row-radio-buttons-group">
                <Grid container>
                  {Points.map((data, index) => (
                    <Grid
                      item
                      mobile={12}
                      tablet={12}
                      miniLaptop={4}
                      laptop={3}
                      desktop={2.36}
                      key={index}
                    >
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
