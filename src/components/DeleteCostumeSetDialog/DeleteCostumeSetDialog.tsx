import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { CostumeSet } from "../../types";

export interface DeleteCostumeSetDialogProps {
  openDelete: boolean;
  onClose: (deleteSet: boolean) => void;
  costumeSet: CostumeSet;
}

const DeleteCostumeSetDialog = ({
  openDelete,
  onClose,
  costumeSet,
}: DeleteCostumeSetDialogProps) => {
  const handleCancel = () => {
    onClose(false);
  };

  const handleDelete = () => {
    onClose(true);
  };

  return (
    <Dialog open={openDelete} keepMounted id="delete-set-dialog">
      <DialogTitle>Delete {costumeSet.name}</DialogTitle>
      <DialogContent dividers>
        <Typography mb={2}>
          This action is <b>irreversible!</b> Are you sure you want to delete
          costume set:
        </Typography>
        <Typography align="center">
          <b>{costumeSet.name}?</b>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          No, Cancel
        </Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCostumeSetDialog;
