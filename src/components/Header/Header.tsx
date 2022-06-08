import { useContext, useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "@mui/material";

import { setUser } from "../../state/reducer";
import { StateContext } from "../../state/state";
import loginService from "../../services/loginService";
import { ColorModeContext, ThemeEnum } from "../../MyTheme/MyTheme";

interface MenuNavPages {
  display: string;
  toPage: string;
}

const menuNavPages: MenuNavPages[] = [
  { display: "Home", toPage: "/" },
  { display: "Sets", toPage: "/sets" },
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [state, dispatch] = useContext(StateContext);
  const navigate = useNavigate();

  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuNav = (toPage: string) => {
    handleCloseNavMenu();
    navigate(toPage);
  };

  const handleLogout = () => {
    loginService.logout();
    dispatch(setUser(null));
    navigate("/logout");
  };

  return (
    <Box sx={{ flexGrow: 1 }} mb={1}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
            <IconButton
              size="large"
              aria-label="app menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              data-cy="header-menu-btn-xs"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {menuNavPages.map((page) => (
                <MenuItem
                  key={page.display}
                  onClick={() => handleMenuNav(page.toPage)}
                  data-cy={`header-menu-${page.display.toLowerCase()}-xs`}
                >
                  {page.display}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
            {menuNavPages.map((page) => (
              <Button
                key={page.display}
                component={Link}
                to={page.toPage}
                color="inherit"
                size="small"
                data-cy={`header-${page.display.toLowerCase()}-btn`}
              >
                {page.display}
              </Button>
            ))}
          </Box>

          <Box mr={1} display="flex" alignItems="center">
            <DarkModeIcon fontSize="small" htmlColor="white" />
            <Switch
              color="default"
              onChange={colorMode.toggleColorMode}
              checked={theme.palette.mode === ThemeEnum.light}
              inputProps={{ "aria-label": "Theme Switch" }}
              data-cy="header-theme-switch"
              size="small"
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
                size="small"
                data-cy="header-login-btn"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                color="secondary"
                size="small"
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
                size="small"
                data-cy="header-profile-btn"
              >
                <Avatar>{state.user.username[0]}</Avatar>
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                size="small"
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
