import { useEffect, useState, useContext, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

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
import { useTitle } from "../../hooks/useTitle";

interface CostumeSetsProps {
  title: string;
  // profile related props
  isProfile?: boolean;
  isMySets?: boolean;
}

const CostumeSets = ({ title, isProfile, isMySets }: CostumeSetsProps) => {
  useTitle(title);
  const [state] = useContext(StateContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [costumeSets, setCostumeSets] = useState<CostumeSet[]>([]);
  const { setErrorMsg, setSuccessMsg, closeNotif, isErr, ...notif } =
    useAlertNotification();
  const [count, setCount] = useState<number>(-1);

  const [prevSearchName, setPrevSearchName] = useState<string>("");

  useEffect(() => {
    void getCostumeSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } else if (isMySets) {
        response = await costumeSetsService.getAllOwned(params);
      } else {
        response = await costumeSetsService.getAll(params);
      }
      if (isLoadMore) {
        setCostumeSets((prev) => [...prev, ...response.costumeSets]);
      } else {
        setCostumeSets(response.costumeSets);
        setCount(response.count);
      }
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: SyntheticEvent, name: string) => {
    event.preventDefault();
    if (loading || prevSearchName === name) {
      setSuccessMsg(`Already showing results for: ${name}`);
      return;
    } else if (!isErr) {
      closeNotif();
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

  return (
    <>
      {loading && <LinearProgress />}
      <AlertNotification
        isErr={isErr}
        closeNotif={closeNotif}
        {...notif}
      ></AlertNotification>
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
            data-cy="sets-create-btn"
          >
            Create
          </Button>
        )}
        <CSSearchForm
          handleSearch={handleSearch}
          loading={loading}
        ></CSSearchForm>
      </Stack>

      {!loading && (
        <Typography>
          <i>Showing {count} set(s)</i>
        </Typography>
      )}

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {costumeSets.map((cosSet) => (
          <Grid item xs={4} sm={4} md={4} key={cosSet.id}>
            <CostumeSetCard
              costumeSet={cosSet}
              isMySet={isMySets}
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
            data-cy="CS-load-more-btn"
          >
            Load More
          </Button>
        </Stack>
      )}
    </>
  );
};

export default CostumeSets;
