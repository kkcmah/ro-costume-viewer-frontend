import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@material-ui/core";

import { useContext, useEffect } from "react";
import CostumeList from "./components/CostumeList/CostumeList";
import loginService from "./services/loginService";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import usersService from "./services/usersService";
import { StateContext } from "./state/state";
import { setUser } from "./state/reducer";
import SignUp from "./components/SignUp/SignUp";
import Logout from "./components/Logout/Logout";
import { Navigate } from "react-router-dom";

const App = () => {
  const [state, dispatch] = useContext(StateContext);

  useEffect(() => {
    const pingpong = async () => {
      try {
        console.log(await loginService.ping());
      } catch (e) {
        console.error(e);
      }
    };

    void pingpong();

    const loadUser = async () => {
      try {
        const user = await usersService.loadUserLocalStorage();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (e) {
        loginService.logout();
        dispatch(setUser(null));
      }
    };

    void loadUser();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header></Header>
          <Routes>
            <Route path="/" element={<CostumeList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/testnav"
              element={
                state.user ? <Navigate to="/"></Navigate> : <Logout></Logout>
              }
            ></Route>
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
