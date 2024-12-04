import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

export type AlertMessageSeverityType = "success" | "info" | "warning" | "error";

export enum AlertMessageSeverity {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  // you can set the variant to be filled (the darker green) add variant="filled"
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

export default function AlertMessage(props: {
  severity: AlertMessageSeverityType;
  message: string;
  timeout?: number;
  visible: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (props.visible) {
      setOpen(true);
    }
  }, [props.visible]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={props.timeout ? props.timeout : 6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={props.severity} sx={{ width: "100%" }}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}
