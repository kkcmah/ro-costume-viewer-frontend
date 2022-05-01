import Alert from "@mui/material/Alert";

interface AlertNotificationProps {
  msg: string;
  isErr: boolean;
  closeNotif: () => void;
}

const AlertNotification = ({ msg, isErr, closeNotif }: AlertNotificationProps) => {
  if (!msg) return null;
  return (
    <Alert
      sx={{ margin: "10px" }}
      severity={isErr ? "error" : "success"}
      onClose={() => {
        closeNotif();
      }}
    >
      {msg}
    </Alert>
  );
};

export default AlertNotification;
