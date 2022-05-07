import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import PublicIcon from "@mui/icons-material/Public";
import Typography from "@mui/material/Typography";
import { CostumeSet } from "../../types";
import { StateContext } from "../../state/state";
import DeleteCostumeSetDialog from "../DeleteCostumeSetDialog/DeleteCostumeSetDialog";
import costumeSetsService from "../../services/costumeSetsService";
import AlertNotification from "../AlertNotification/AlertNotification";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import { formatErrorAsString } from "../../services/helpersService";

interface CostumeSetCardProps {
  costumeSet: CostumeSet;
  toggleLikeSet: (costumeSetId: string) => Promise<void>;
  // from profile my sets
  isMySet?: boolean;
}

const CostumeSetCard = ({
  costumeSet,
  toggleLikeSet,
  isMySet,
}: CostumeSetCardProps) => {
  const [state] = useContext(StateContext);

  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setErrorMsg, setSuccessMsg, closeNotif, isErr, msg } =
    useAlertNotification();

  const numOfCostumesToShow = 12;
  const disableButtons = isDeleted || loading || false;
  const DELETED_MSG = "Alas, I've been deleted :(";

  // truncate the description and suffix it with ... if its too long
  const descToShow = (desc: string): string => {
    const maxLength = 150;
    if (desc.length > maxLength) {
      return desc.slice(0, maxLength) + "...";
    }
    return desc;
  };

  const handleClickDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDeleteDialog = (deleteSet: boolean) => {
    setOpenDelete(false);
    if (deleteSet) {
      void deleteCostumeSet();
    }
  };

  const deleteCostumeSet = async () => {
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

  const temp = [3, 234, 52, 35, 2, 3, 12, 123, 123, 124, 124, 124, 124];
  //costumeSet.costumes.

  //costumeSet.description
  const desc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate nunc purus, ut porta morbi.m ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate nunc purus, ";

  return (
    <Card>
      {loading && <LinearProgress />}
      <AlertNotification
        isErr={isErr}
        closeNotif={closeNotif}
        msg={msg}
      ></AlertNotification>
      {isDeleted && !msg && <Alert severity="error">{DELETED_MSG}</Alert>}
      <CardHeader
        title={costumeSet.name}
        subheader={`created by: ${costumeSet.owner.username}`}
        action={
          isMySet &&
          (disableButtons ? (
            <PublicIcon color="disabled" />
          ) : (
            <PublicIcon color={costumeSet.isPublic ? "primary" : "disabled"} />
          ))
        }
      />
      <CardContent>
        <Grid
          container
          mb={1}
          spacing={{ xs: 1 }}
          columns={{ xs: 6, sm: 8, md: 12 }}
        >
          {temp.slice(0, numOfCostumesToShow).map((cos, ind) => (
            <Grid item xs={2} sm={2} md={2} key={ind}>
              <Typography
                m="auto"
                component="div"
                className="costume costume-18740"
              ></Typography>
            </Grid>
          ))}
        </Grid>
        {temp.length > numOfCostumesToShow && (
          <Typography variant="caption">And more...</Typography>
        )}
        <Typography variant="body1">{descToShow(desc)}</Typography>
      </CardContent>
      <CardActions>
        <IconButton
          disabled={!state.user || disableButtons}
          aria-label="toggle like"
          onClick={() => void toggleLikeSet(costumeSet.id)}
        >
          {disableButtons ? (
            <FavoriteIcon color="disabled"></FavoriteIcon>
          ) : (
            <FavoriteIcon
              color={
                state.user?.likedCostumeSets.includes(costumeSet.id)
                  ? "error"
                  : "inherit"
              }
            />
          )}
        </IconButton>
        <Typography variant="body2" mr={"auto"}>
          {costumeSet.likes}
        </Typography>
        {isMySet && (
          <Typography mr="auto">
            <IconButton
              disabled={disableButtons}
              component={Link}
              to={`/sets/edit/${costumeSet.id}`}
            >
              <EditIcon color={disableButtons ? "disabled" : "primary"} />
            </IconButton>
            <IconButton disabled={disableButtons} onClick={handleClickDelete}>
              <DeleteIcon color={disableButtons ? "disabled" : "error"} />
            </IconButton>
          </Typography>
        )}
        <Button
          size="small"
          disabled={disableButtons}
          component={Link}
          to={`/sets/${costumeSet.id}`}
        >
          Details
        </Button>
      </CardActions>
      <DeleteCostumeSetDialog
        openDelete={openDelete}
        onClose={handleCloseDeleteDialog}
        costumeSet={costumeSet}
      ></DeleteCostumeSetDialog>
      {isDeleted && !msg && <Alert severity="error">{DELETED_MSG}</Alert>}
    </Card>
  );
};

export default CostumeSetCard;
