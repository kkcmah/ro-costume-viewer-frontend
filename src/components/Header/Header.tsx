import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { setUser } from "../../state/reducer";
import { StateContext } from "../../state/state";
import loginService from "../../services/loginService";
import { ColorModeContext } from "../../MyTheme/MyTheme";

const Header = () => {
  const [state, dispatch] = useContext(StateContext);
  const navigate = useNavigate();

  const colorMode = useContext(ColorModeContext);

  const handleLogout = () => {
    loginService.logout();
    dispatch(setUser(null));
    navigate("/logout");
  };

  return (
    <Box sx={{ flexGrow: 1 }} mb={1}>
      <AppBar position="static">
        <Toolbar>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button
            component={Link}
            to="/sets"
            color="inherit"
            sx={{ marginRight: "auto" }}
          >
            Sets
          </Button>
          <Box mr={1} display="flex" alignItems="center">
            <DarkModeIcon fontSize="small" htmlColor="white" />
            <Switch
              color="default"
              onChange={colorMode.toggleColorMode}
            ></Switch>
            <LightModeIcon fontSize="small" htmlColor="yellow" />
          </Box>
          {!state.user && (
            <>
              <Button
                sx={{ mr: 1 }}
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                data-cy="header-login-btn"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                color="secondary"
                data-cy="header-signup-btn"
              >
                Sign Up
              </Button>
            </>
          )}
          {state.user && (
            <>
              <Button
                component={Link}
                to="/profile"
                color="inherit"
                data-cy="header-profile-btn"
              >
                <Avatar>{state.user.username[0]}</Avatar>
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                data-cy="header-logout-btn"
              >
                Log out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
