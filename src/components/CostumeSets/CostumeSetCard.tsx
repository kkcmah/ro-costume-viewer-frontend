import { memo, useContext, useEffect, useRef, useState } from "react";
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
import { setLikedSets } from "../../state/reducer";

const DELETED_MSG = "Alas, I've been deleted :(";
const numOfCostumesToShow = 12;

interface CostumeSetCardProps {
  costumeSet: CostumeSet;
  // from profile my sets
  isMySet?: boolean;
}

const CostumeSetCard = ({ costumeSet, isMySet }: CostumeSetCardProps) => {
  const [state, dispatch] = useContext(StateContext);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setErrorMsg, setSuccessMsg, closeNotif, isErr, msg } =
    useAlertNotification();
  const [loadingLikeClick, setLoadingLikeClick] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [initialLiked, setInitialLiked] = useState<boolean>(false);
  const [raised, setRaised] = useState<boolean>(false);
  const costumeSetLikes = useRef<number>(costumeSet.likes);

  useEffect(() => {
    if (state.user) {
      const like = state.user.likedCostumeSets.includes(costumeSet.id);
      setLiked(like);
      setInitialLiked(like);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disableButtons = isDeleted || loading || false;

  const numLikesToDisplay = (() => {
    if (initialLiked && !liked) {
      return costumeSetLikes.current - 1;
    } else if (!initialLiked && liked) {
      return costumeSetLikes.current + 1;
    }
    return costumeSetLikes.current;
  })();

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

  const updateLikedSets = async (costumeSetId: string, newLiked: boolean) => {
    if (!state.user) {
      return;
    }
    setLiked(newLiked);

    let actualLikedSets;
    if (newLiked) {
      actualLikedSets = await costumeSetsService.likeSet(costumeSetId);
    } else {
      actualLikedSets = await costumeSetsService.unlikeSet(costumeSetId);
    }

    dispatch(setLikedSets(actualLikedSets));
  };

  const toggleLikeSet = async (costumeSetId: string) => {
    if (!state.user) {
      setErrorMsg("Login to like sets.");
      return;
    }
    if (loadingLikeClick) {
      return;
    }
    try {
      setLoadingLikeClick(true);
      await updateLikedSets(costumeSetId, !liked);
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoadingLikeClick(false);
    }
  };

  // const temp = [3, 234, 52, 35, 2, 3, 12, 123, 123, 124, 124, 124, 124];
  //costumeSet.costumes.

  //costumeSet.description
  // const desc =
  //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate nunc purus, ut porta morbi.m ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate nunc purus, ";

  const handleMouseEnter = () => {
    setRaised(true);
  };

  const handleMouseLeave = () => {
    setRaised(false);
  };

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      raised={raised}
    >
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
            <PublicIcon color={costumeSet.isPublic ? "info" : "disabled"} />
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
          {costumeSet.costumes.slice(0, numOfCostumesToShow).map((cos) => (
            <Grid item xs={2} sm={2} md={2} key={cos.id}>
              <Typography
                m="auto"
                component="div"
                className={cos.className}
              ></Typography>
            </Grid>
          ))}
        </Grid>
        {costumeSet.costumes.length > numOfCostumesToShow && (
          <Typography variant="caption">And more...</Typography>
        )}
        <Typography variant="body1">
          {descToShow(costumeSet.description)}
        </Typography>
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
            <FavoriteIcon htmlColor={liked ? "red" : undefined} />
          )}
        </IconButton>
        <Typography variant="body2" mr={"auto"}>
          {numLikesToDisplay}
        </Typography>
        {isMySet && (
          <Typography mr="auto">
            <IconButton
              disabled={disableButtons}
              component={Link}
              to={`/sets/edit/${costumeSet.id}`}
            >
              <EditIcon color={disableButtons ? "disabled" : "info"} />
            </IconButton>
            <IconButton disabled={disableButtons} onClick={handleClickDelete}>
              <DeleteIcon htmlColor={disableButtons ? "disabled" : "red"} />
            </IconButton>
          </Typography>
        )}
        <Button
          size="small"
          color="info"
          disabled={disableButtons}
          component={Link}
          to={
            isMySet ? `/sets/owned/${costumeSet.id}` : `/sets/${costumeSet.id}`
          }
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

export default memo(CostumeSetCard);
