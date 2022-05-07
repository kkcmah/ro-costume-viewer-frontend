import { useContext, useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { StateContext } from "../../state/state";
import CostumeList from "../CostumeList/CostumeList";
import CreateSetForm, { CreateSetFormValues } from "./CreateSetForm";
import { Costume, CostumeSet, NewCostumeSet } from "../../types";
import CostumesToAddList from "./CostumesToAddList";
import { formatErrorAsString } from "../../services/helpersService";
import costumeSetsService from "../../services/costumeSetsService";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import AlertNotification from "../AlertNotification/AlertNotification";
import { useTitle } from "../../hooks/useTitle";

interface CreateCostumeSetProps {
  title: string;
  // props coming from edit set
  pageTitle?: string;
  isEdit?: boolean;
  costumeSet?: CostumeSet;
}

const CreateCostumeSet = ({
  title,
  pageTitle = "Create Set",
  isEdit,
  costumeSet,
}: CreateCostumeSetProps) => {
  useTitle(title);
  const [state] = useContext(StateContext);
  // instead of handling costumeIds in form
  const [costumesInSet, setCostumesInSet] = useState<Costume[]>([]);
  const { setErrorMsg, ...notif } = useAlertNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<CreateSetFormValues>({
    name: "",
    description: "",
    isPublic: false,
  });

  const hasCostumesInSet = costumesInSet.length > 0 ? true : false;

  useEffect(() => {
    if (isEdit && costumeSet) {
      setInitialValues({
        name: costumeSet.name,
        description: costumeSet.description,
        isPublic: costumeSet.isPublic,
      });
      setCostumesInSet(costumeSet.costumes);
    }
  }, []);

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

  // note to future: using same type as create because I made all field editable
  const handleEdit = async (formValues: CreateSetFormValues) => {
    if (!costumeSet) return;
    try {
      setLoading(true);
      const editedCostumeSet: NewCostumeSet = {
        name: formValues.name,
        description: formValues.description,
        costumes: costumesInSet.map((cos) => cos.id),
        isPublic: formValues.isPublic,
      };
      await costumeSetsService.editSet(editedCostumeSet, costumeSet.id);
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
        {pageTitle}
      </Typography>
      <AlertNotification {...notif}></AlertNotification>
      {/* TODO put some sort of delete set button here if editing*/}
      <Paper sx={{ marginBottom: 1 }}>
        <CreateSetForm
          handleCreate={handleCreate}
          isEdit={isEdit}
          handleEdit={handleEdit}
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
