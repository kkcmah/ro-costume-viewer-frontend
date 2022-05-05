import { useContext, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { StateContext } from "../../state/state";
import CostumeList from "../CostumeList/CostumeList";
import CreateSetForm, { CreateSetFormValues } from "./CreateSetForm";
import { Costume, NewCostumeSet } from "../../types";
import CostumesToAddList from "./CostumesToAddList";
import { formatErrorAsString } from "../../services/helpersService";
import costumeSetsService from "../../services/costumeSetsService";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import AlertNotification from "../AlertNotification/AlertNotification";
import { useTitle } from "../../hooks/useTitle";

interface CreateCostumeSetProps {
  title: string;
}

const CreateCostumeSet = ({ title }: CreateCostumeSetProps) => {
  useTitle(title);
  const [state] = useContext(StateContext);
  // instead of handling costumeIds in form
  const [costumesInSet, setCostumesInSet] = useState<Costume[]>([]);
  const { setErrorMsg, ...notif } = useAlertNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const hasCostumesInSet = costumesInSet.length > 0 ? true : false;

  const initialValues: CreateSetFormValues = {
    name: "",
    description: "",
    isPublic: false,
  };

  const handleCosCheckChange = (costumeChanged: Costume) => {
    let found = false;
    for (const costume of costumesInSet) {
      if (costume.id === costumeChanged.id) {
        found = true;
        break;
      }
    }
    if (found) {
      setCostumesInSet((prev) => {
        return prev.filter((cos) => cos.id !== costumeChanged.id);
      });
    } else {
      setCostumesInSet((prev) => [...prev, costumeChanged]);
    }
  };

  const handleRemove = (costumeIdToRemove: string) => {
    setCostumesInSet((prev) => {
      return prev.filter((cos) => cos.id !== costumeIdToRemove);
    });
  };

  const handleCreate = async (formValues: CreateSetFormValues) => {
    try {
      setLoading(true);
      const newCostumeSet: NewCostumeSet = {
        name: formValues.name,
        description: formValues.description,
        costumes: costumesInSet.map((cos) => cos.id),
        isPublic: formValues.isPublic,
      };
      await costumeSetsService.createSet(newCostumeSet);
      setIsSubmitted(true);
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoading(false);
    }
  };

  if (!state.user) return <h2>You must be logged in to create a set.</h2>;
  return (
    <>
      {loading && <LinearProgress />}
      <Typography mb={1} variant="h5">
        Create Set
      </Typography>
      <AlertNotification {...notif}></AlertNotification>
      <Paper sx={{ marginBottom: 1 }}>
        <CreateSetForm
          handleCreate={handleCreate}
          initialValues={initialValues}
          hasCostumesInSet={hasCostumesInSet}
          isSubmitted={isSubmitted}
        ></CreateSetForm>
        <CostumesToAddList
          costumesInSet={costumesInSet}
          handleRemove={handleRemove}
        ></CostumesToAddList>
      </Paper>
      <CostumeList
        isCreatingSet={true}
        handleCosCheckChange={handleCosCheckChange}
        costumesInSet={costumesInSet}
      ></CostumeList>
    </>
  );
};

export default CreateCostumeSet;
