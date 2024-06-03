import { SnackbarOrigin, VariantType, enqueueSnackbar } from "notistack";

const handleNotificationMessege = (
  messege: string,
  variant?: VariantType,
  anchorOrigin?: SnackbarOrigin
) => {
  console.log("🚀 ~ messege:", messege);
  enqueueSnackbar(messege, { variant, anchorOrigin });
};
export default handleNotificationMessege;
