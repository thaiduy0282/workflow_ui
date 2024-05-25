import "./style.css";

import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { Close, Done } from "@mui/icons-material";

import DeleteIcon from "@mui/icons-material/Delete";
import Drawer from "@mui/material/Drawer";

const DrawerLayout = ({ open, close, currentNode, onChangeNodeName }: any) => {
  const DrawerContent = (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
    >
      <Typography variant="h5" fontWeight={700}>
        {currentNode?.id === "trigger" ? "TRIGGER" : "ACTION"}
      </Typography>
      <Divider sx={{ width: "100%" }} />
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <TextField
          id="name"
          label="Name"
          variant="filled"
          defaultValue={currentNode?.data?.label}
          onChange={(evt) => onChangeNodeName(evt.target.value)}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<Close />} onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<Done />} onClick={close}>
            Save
          </Button>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={close}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
  return (
    <Drawer open={open} onClose={close} anchor="right">
      {DrawerContent}
    </Drawer>
  );
};

export default DrawerLayout;
