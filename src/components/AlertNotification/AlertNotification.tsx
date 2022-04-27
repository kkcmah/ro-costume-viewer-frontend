import Alert from "@mui/material/Alert";

interface NotificationProps {
  msg: string;
  isErr: boolean;
  closeNotif: () => void;
}

const Notification = ({ msg, isErr, closeNotif }: NotificationProps) => {
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

export default Notification;
