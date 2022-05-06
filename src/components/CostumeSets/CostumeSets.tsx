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
import {
  CostumeSet,
  CostumeSetsPagedParams,
  CostumeSetsWithCount,
} from "../../types";
import AlertNotification from "../AlertNotification/AlertNotification";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import CSSearchForm from "./CSSearchForm";
import { StateContext } from "../../state/state";
import CostumeSetCard from "./CostumeSetCard";
import { setLikedSets } from "../../state/reducer";
import { useTitle } from "../../hooks/useTitle";

interface CostumeSetsProps {
  title: string;
  // profile related props
  isProfile?: boolean;
}

const CostumeSets = ({ title, isProfile }: CostumeSetsProps) => {
  useTitle(title);
  const [state, dispatch] = useContext(StateContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [costumeSets, setCostumeSets] = useState<CostumeSet[]>([]);
  const { setErrorMsg, ...notif } = useAlertNotification();
  const [count, setCount] = useState<number>(-1);

  const [name, setName] = useState<string>("");
  const [prevSearchName, setPrevSearchName] = useState<string>("");
  const [loadingLikeClick, setLoadingLikeClick] = useState<boolean>(false);

  useEffect(() => {
    void getCostumeSets();
  }, []);

  const getCostumeSets = async (
    params: CostumeSetsPagedParams = {},
    isLoadMore = false
  ) => {
    try {
      setLoading(true);
      let response: CostumeSetsWithCount = {
        costumeSets: [],
        count: 0,
      };
      if (isProfile) {
        response = await costumeSetsService.getAllLikedPubOrOwn(params);
      } else {
        response = await costumeSetsService.getAll(params);
      }
      console.log(response, isLoadMore);
      setCount(20);
      setCostumeSets((prev) => [...prev, ...response.costumeSets]);
      // if (isLoadMore) {
      //   setCostumeSets((prev) => [...prev, ...response.costumeSets]);
      // } else {
      //   setCostumeSets(response.costumeSets);
      //   setCount(response.count);
      // }
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
    if (loading) {
      return;
    }
    const params: CostumeSetsPagedParams = {
      name,
    };
    setPrevSearchName(name);
    void getCostumeSets(params);
  };

  const handleLoadMore = () => {
    if (loading) {
      return;
    }
    const params: CostumeSetsPagedParams = {
      lastSeenIds: costumeSets.map((cs) => cs.id),
      name: prevSearchName,
    };
    if (costumeSets.length > 0) {
      params.lastLikeValue = costumeSets[costumeSets.length - 1].likes;
    }
    void getCostumeSets(params, true);
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
    if (loadingLikeClick) {
      return;
    }
    try {
      setLoadingLikeClick(true);
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
    } finally {
      setLoadingLikeClick(false);
    }
  };

  return (
    <>
      {loading && <LinearProgress />}
      <AlertNotification {...notif}></AlertNotification>
      <Stack
        direction="row"
        justifyContent={state.user && !isProfile ? "space-between" : "end"}
        mb={1}
      >
        {state.user && !isProfile && (
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
          loading={loading}
        ></CSSearchForm>
      </Stack>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {costumeSets.map((cosSet, ind) => (
          <Grid item xs={4} sm={4} md={4} key={ind}>
            <CostumeSetCard
              costumeSet={cosSet}
              toggleLikeSet={toggleLikeSet}
            ></CostumeSetCard>
          </Grid>
        ))}
      </Grid>
      {costumeSets.length < count && (
        <Stack m={1} direction="row" justifyContent="center">
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loading}
          >
            Load More
          </Button>
        </Stack>
      )}
      {count}
      {costumeSets.length}
    </>
  );
};

export default CostumeSets;
