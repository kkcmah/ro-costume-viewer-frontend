import { useContext, useState, SyntheticEvent } from "react";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { StateContext } from "../../state/state";
import { useTitle } from "../../hooks/useTitle";
import CostumeList from "../CostumeList/CostumeList";
import { Link as RouterLink } from "react-router-dom";
import CostumeSets from "../CostumeSets/CostumeSets";

interface ProfileProps {
  title: string;
}

const Profile = ({ title }: ProfileProps) => {
  useTitle(title);
  const [state] = useContext(StateContext);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const TABS_OBJ = { "my-sets": 0, "fav-costumes": 1, "liked-sets": 2 };
  const TABS = Object.keys(TABS_OBJ);
  const tabA11yProps = (index: number) => {
    return {
      id: `${TABS[index]}-tab`,
      "aria-controls": `${TABS[index]}-tabpanel`,
      // prop for testing
      "data-cy": `profile-tab-${TABS[index]}`,
    };
  };

  const tabPanelA11yProps = (index: number) => {
    return {
      role: "tabpanel",
      id: `${TABS[index]}-tabpanel`,
      "aria-controls": `${TABS[index]}-tab`,
    };
  };

  if (!state.user) {
    return <h2>There is no profile to view. Try signing up or logging in.</h2>;
  }
  return (
    <Box>
      <Typography variant="h4">Hi {state.user.username}</Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 1 }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="profile tabs"
        >
          <Tab label="My Sets" {...tabA11yProps(TABS_OBJ["my-sets"])} />
          <Tab
            label="Favorite Costumes"
            {...tabA11yProps(TABS_OBJ["fav-costumes"])}
          />
          <Tab label="Liked Sets" {...tabA11yProps(TABS_OBJ["liked-sets"])} />
        </Tabs>
      </Box>
      <div
        hidden={tabValue !== TABS_OBJ["my-sets"]}
        {...tabPanelA11yProps(TABS_OBJ["my-sets"])}
      >
        {tabValue === TABS_OBJ["my-sets"] && (
          <CostumeSets title={title} isMySets={true}></CostumeSets>
        )}
      </div>
      <div
        hidden={tabValue !== TABS_OBJ["fav-costumes"]}
        {...tabPanelA11yProps(TABS_OBJ["fav-costumes"])}
      >
        {tabValue === TABS_OBJ["fav-costumes"] && (
          <>
            {state.user.favCostumes.length === 0 && (
              <Alert severity="info">
                Looks like you do not have any favorite costumes :(. Head{" "}
                <Link component={RouterLink} to="/">
                  Home
                </Link>{" "}
                to add some.
              </Alert>
            )}
            <CostumeList isProfile={true}></CostumeList>
          </>
        )}
      </div>
      <div
        hidden={tabValue !== TABS_OBJ["liked-sets"]}
        {...tabPanelA11yProps(TABS_OBJ["liked-sets"])}
      >
        {tabValue === TABS_OBJ["liked-sets"] && (
          <>
            {state.user.likedCostumeSets.length === 0 && (
              <Alert severity="info">
                Looks like you do not have any liked costume sets :(. Head to{" "}
                <Link component={RouterLink} to="/sets">
                  Sets
                </Link>{" "}
                to add some.
              </Alert>
            )}
            <CostumeSets title={title} isProfile={true}></CostumeSets>
          </>
        )}
      </div>
    </Box>
  );
};

export default Profile;
