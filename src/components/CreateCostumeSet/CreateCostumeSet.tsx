import { useContext, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
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
import DeleteCostumeSetDialog from "../DeleteCostumeSetDialog/DeleteCostumeSetDialog";
import { Link } from "react-router-dom";

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
  const { setErrorMsg, setSuccessMsg, closeNotif, isErr, msg } =
    useAlertNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<CreateSetFormValues>({
    name: "",
    description: "",
    isPublic: false,
  });
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const hasCostumesInSet = costumesInSet.length > 0 ? true : false;
  const DELETED_MSG = "Alas, I've been deleted :(";
  const disableButtons = isDeleted || loading || false;

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
    if (!costumeSet || disableButtons) return;
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

  const handleClickDelete = () => {
    if (!disableButtons) {
      setOpenDelete(true);
    }
  };

  const handleCloseDeleteDialog = (deleteSet: boolean) => {
    setOpenDelete(false);
    if (deleteSet) {
      void deleteCostumeSet();
    }
  };

  const deleteCostumeSet = async () => {
    if (!costumeSet || disableButtons) {
      return;
    }
    try {
      setLoading(true);
      const res = await costumeSetsService.deleteSet(costumeSet.id);
      setSuccessMsg(res.message);
      setIsDeleted(true);
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
      <AlertNotification
        isErr={isErr}
        closeNotif={closeNotif}
        msg={msg}
      ></AlertNotification>
      {isDeleted && !msg && (
        <Alert severity="error">
          {DELETED_MSG}
          <Typography>
            Head to <Link to="/profile">Profile</Link>
          </Typography>
        </Alert>
      )}
      {isEdit && (
        <Typography mb={1} component="div" display="flex" justifyContent="end">
          <Button
            color="error"
            variant="outlined"
            onClick={handleClickDelete}
            disabled={disableButtons}
          >
            Delete Set
          </Button>
        </Typography>
      )}
      <Paper sx={{ marginBottom: 1 }}>
        <CreateSetForm
          handleCreate={handleCreate}
          isEdit={isEdit}
          handleEdit={handleEdit}
          initialValues={initialValues}
          hasCostumesInSet={hasCostumesInSet}
          isSubmitted={isSubmitted}
          disableButtons={disableButtons}
        ></CreateSetForm>
        {isDeleted && (
          <Alert severity="error">
            {DELETED_MSG}
            <Typography>
              Head to <Link to="/profile">Profile</Link>
            </Typography>
          </Alert>
        )}
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
      {isEdit && costumeSet && (
        <DeleteCostumeSetDialog
          openDelete={openDelete}
          onClose={handleCloseDeleteDialog}
          costumeSet={costumeSet}
        ></DeleteCostumeSetDialog>
      )}
    </>
  );
};

export default CreateCostumeSet;
