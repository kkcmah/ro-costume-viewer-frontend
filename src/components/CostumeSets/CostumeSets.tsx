import {
  useEffect,
  useState,
  useContext,
  ChangeEvent,
  SyntheticEvent,
} from "react";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import costumeSetsService from "../../services/costumeSetsService";
import { formatErrorAsString } from "../../services/helpersService";
import { CostumeSet } from "../../types";
import AlertNotification from "../AlertNotification/AlertNotification";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import CSSearchForm from "./CSSearchForm";
import { StateContext } from "../../state/state";
import CostumeSetCard from "./CostumeSetCard";
import { setLikedSets } from "../../state/reducer";

const CostumeSets = () => {
  const [state, dispatch] = useContext(StateContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [costumeSets, setCostumeSets] = useState<CostumeSet[]>([]);
  const { setErrorMsg, ...notif } = useAlertNotification();
  const [count, setCount] = useState<number>(-1);

  const [name, setName] = useState("");

  useEffect(() => {
    void getCostumeSets();
  }, []);

  const getCostumeSets = async (name = "") => {
    try {
      setLoading(true);
      const response = await costumeSetsService.getAll(name);
      console.log(response);
      setCostumeSets((prev) => [...prev, ...response]);
      setCount(5);
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSearch = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log("Search", name);
    void getCostumeSets();
  };

  const updateLikeSetState = (costumeSetId: string, like: boolean) => {
    const inc = like ? 1 : -1;
    setCostumeSets((prev) => {
      return prev.map((set) => {
        if (set.id === costumeSetId) {
          return { ...set, likes: set.likes + inc };
        } else {
          return set;
        }
      });
    });
  };

  const toggleLikeSet = async (costumeSetId: string) => {
    if (!state.user) {
      setErrorMsg("Login to like sets.");
      return;
    }
    try {
      if (state.user.likedCostumeSets.includes(costumeSetId)) {
        const likedSets = await costumeSetsService.unlikeSet(costumeSetId);
        dispatch(setLikedSets(likedSets));
        updateLikeSetState(costumeSetId, false);
      } else {
        const likedSets = await costumeSetsService.likeSet(costumeSetId);
        dispatch(setLikedSets(likedSets));
        updateLikeSetState(costumeSetId, true);
      }
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    }
  };

  return (
    <>
      {loading && <LinearProgress />}
      <AlertNotification {...notif}></AlertNotification>
      <Stack
        direction="row"
        justifyContent={state.user ? "space-between" : "end"}
        mb={1}
      >
        {state.user && (
          <Button
            size="small"
            variant="outlined"
            component={Link}
            to="/sets/create"
          >
            Create
          </Button>
        )}
        <CSSearchForm
          name={name}
          handleChange={handleChange}
          handleSearch={handleSearch}
        ></CSSearchForm>
      </Stack>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {costumeSets.map((cosSet, ind) => (
          <Grid item xs={2} sm={4} md={4} key={ind}>
            <CostumeSetCard
              costumeSet={cosSet}
              toggleLikeSet={toggleLikeSet}
            ></CostumeSetCard>
          </Grid>
        ))}
      </Grid>
      {count}
    </>
  );
};

export default CostumeSets;
