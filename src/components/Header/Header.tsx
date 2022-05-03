import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../state/reducer";
import { useContext } from "react";
import { StateContext } from "../../state/state";
import loginService from "../../services/loginService";

const Header = () => {
  const [state, dispatch] = useContext(StateContext);
  const navigate = useNavigate();

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
          {!state.user && (
            <>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/signup" color="inherit">
                Sign Up
              </Button>
            </>
          )}
          {state.user && (
            <>
              <span>Logged in as {state.user.username}</span>
              <Button color="inherit" onClick={handleLogout}>
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
