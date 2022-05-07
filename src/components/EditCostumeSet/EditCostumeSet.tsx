import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { useTitle } from "../../hooks/useTitle";
import costumeSetsService from "../../services/costumeSetsService";
import { formatErrorAsString } from "../../services/helpersService";
import { StateContext } from "../../state/state";
import { CostumeSet } from "../../types";
import AlertNotification from "../AlertNotification/AlertNotification";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import CreateCostumeSet from "../CreateCostumeSet/CreateCostumeSet";

interface EditCostumeSetProps {
  title: string;
}

// re use create costume set
const EditCostumeSet = ({ title }: EditCostumeSetProps) => {
  useTitle(title);
  const { costumeSetId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [state] = useContext(StateContext);
  const [costumeSet, setCostumeSet] = useState<CostumeSet>();
  const { setErrorMsg, isErr, ...notif } = useAlertNotification();

  useEffect(() => {
    if (costumeSetId) {
      void getCostumeSet(costumeSetId);
    }
  }, []);

  const getCostumeSet = async (costumeSetId: string) => {
    try {
      setLoading(true);
      const costumeSetApi = await costumeSetsService.getOwnedById(costumeSetId);

      if (!costumeSetApi) {
        setErrorMsg("Costume set unable to be found");
      } else {
        setCostumeSet(costumeSetApi);
      }
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoading(false);
    }
  };

  if (!state.user) return <h2>You must be logged in to edit a set.</h2>;
  if (!costumeSet || isErr)
    return (
      <>
        {loading && <LinearProgress />}
        <AlertNotification isErr {...notif}></AlertNotification>
      </>
    );
  return (
    <CreateCostumeSet
      title={title}
      pageTitle="Edit Set"
      isEdit={true}
      costumeSet={costumeSet}
    ></CreateCostumeSet>
  );
};

export default EditCostumeSet;
