import { useState } from "react";

const useAlertNotification = () => {
  const [isErr, setIsErr] = useState(false);
  const [msg, setMsg] = useState("");

  const closeNotif = () => {
    setIsErr(false);
    setMsg("");
  };

  const setSuccessMsg = (msg: string) => {
    setIsErr(false);
    setMsg(msg);
  };

  const setErrorMsg = (msg: string) => {
    setIsErr(true);
    setMsg(msg);
  };

  return { isErr, msg, closeNotif, setSuccessMsg, setErrorMsg };
};

export default useAlertNotification;
