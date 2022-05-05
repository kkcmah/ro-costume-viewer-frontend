import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import costumeSetsService from "../../services/costumeSetsService";
import { formatErrorAsString } from "../../services/helpersService";
import { CostumeSet } from "../../types";
import AlertNotification from "../AlertNotification/AlertNotification";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import CSDCostumeCard from "./CSDCostumeCard";
import { StateContext } from "../../state/state";
import { setLikedSets } from "../../state/reducer";

const CostumeSetDetail = () => {
  const { costumeSetId } = useParams();
  const { setErrorMsg, ...notif } = useAlertNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [costumeSet, setCostumeSet] = useState<CostumeSet>();
  const [state, dispatch] = useContext(StateContext);
  const [likes, setLikes] = useState<number>(42);
  const [loadingLikeClick, setLoadingLikeClick] = useState<boolean>(false);

  useEffect(() => {
    if (costumeSetId) {
      void getCostumeSet(costumeSetId);
    }
  }, []);

  const getCostumeSet = async (costumeSetId: string) => {
    try {
      setLoading(true);
      const costumeSetApi = await costumeSetsService.getById(costumeSetId);

      if (!costumeSetApi) {
        setErrorMsg("Costume set unable to be found");
      } else {
        setCostumeSet(costumeSetApi);
        setLikes(costumeSetApi.likes);
      }
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoading(false);
    }
  };

  const toggleLikeSet = async () => {
    if (!state.user) {
      setErrorMsg("Login to like sets.");
      return;
    }
    if (!costumeSet || loadingLikeClick) {
      return;
    }
    try {
      setLoadingLikeClick(true);
      if (state.user.likedCostumeSets.includes(costumeSet.id)) {
        const likedSets = await costumeSetsService.unlikeSet(costumeSet.id);
        dispatch(setLikedSets(likedSets));
        updateLikeSetState(false);
      } else {
        const likedSets = await costumeSetsService.likeSet(costumeSet.id);
        dispatch(setLikedSets(likedSets));
        updateLikeSetState(true);
      }
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoadingLikeClick(false);
    }
  };

  const updateLikeSetState = (like: boolean) => {
    const inc = like ? 1 : -1;
    setLikes((prev) => prev + inc);
  };

  if (!costumeSet) return <AlertNotification {...notif}></AlertNotification>;

  return (
    <>
      {loading && <LinearProgress />}
      <AlertNotification {...notif}></AlertNotification>
      <Grid container mx="auto" maxWidth={{ xs: "800px", lg: "1200px" }}>
        <Grid item xs={12} mb={1} textAlign="center">
          <Typography variant="h3">{costumeSet.name}</Typography>
          <Typography variant="subtitle1">
            Created by: {costumeSet.owner.username}
          </Typography>
          <Typography variant="subtitle2">
            {new Date(costumeSet.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">{costumeSet.description}</Typography>
          <Typography>
            <IconButton
              disabled={!state.user}
              color={
                state.user?.likedCostumeSets.includes(costumeSet.id)
                  ? "error"
                  : "default"
              }
              aria-label="toggle like"
              onClick={() => void toggleLikeSet()}
            >
              <FavoriteIcon /> {likes}
            </IconButton>
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2} mb={1}>
          {costumeSet.costumes.map((cos) => (
            <Grid item xs={12} sm={6} lg={4} key={cos.id}>
              <CSDCostumeCard costume={cos}></CSDCostumeCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default CostumeSetDetail;
