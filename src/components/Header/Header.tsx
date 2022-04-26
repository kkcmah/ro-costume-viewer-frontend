import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { setUser } from "../../state/reducer";
import { useContext } from "react";
import { StateContext } from "../../state/state";
import loginService from "../../services/loginService";

const Header = () => {
  const [state, dispatch] = useContext(StateContext);

  const handleLogout = () => {
    loginService.logout();
    dispatch(setUser(null));
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{ marginRight: "auto" }}
          >
            Home
          </Button>
          {!state.user && (
            <>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button color="inherit">Sign Up</Button>
            </>
          )}
          {state.user && (
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
