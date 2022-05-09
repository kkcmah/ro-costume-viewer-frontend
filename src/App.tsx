import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "@mui/material/Container";

import { useContext, useEffect, useState } from "react";
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
import NoMatchPage from "./components/NoMatchPage/NoMatchPage";
import CostumeSets from "./components/CostumeSets/CostumeSets";
import CreateCostumeSet from "./components/CreateCostumeSet/CreateCostumeSet";
import Profile from "./components/Profile/Profile";
import CostumeSetDetail from "./components/CostumeSetDetail/CostumeSetDetail";
import { APP_TITLE } from "./constants";
import EditCostumeSet from "./components/EditCostumeSet/EditCostumeSet";
import LoadingPage from "./components/LoadingPage/LoadingPage";

const App = () => {
  const [state, dispatch] = useContext(StateContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [doneFromLP, setDoneFromLP] = useState<boolean>(false);

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
        setLoading(true);
        const user = await usersService.loadUserLocalStorage();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (e) {
        loginService.logout();
        dispatch(setUser(null));
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    void loadUser();
  }, [dispatch]);

  const handleLPDoneClick = () => {
    setDoneFromLP(true);
  };

  return (
    <>
      {!doneFromLP && (
        <LoadingPage
          loading={loading}
          handleLPDoneClick={handleLPDoneClick}
        ></LoadingPage>
      )}
      {!loading && (
        <div className="App" hidden={!doneFromLP}>
          <Router>
            <Container>
              <Header></Header>
              <Routes>
                <Route
                  path="/"
                  element={<CostumeList title={APP_TITLE + "Home"} />}
                />
                <Route
                  path="/login"
                  element={<Login title={APP_TITLE + "Login"} />}
                />
                <Route
                  path="/signup"
                  element={<SignUp title={APP_TITLE + "Sign Up"} />}
                />
                <Route
                  path="/logout"
                  element={<Logout title={APP_TITLE + "Logout"} />}
                />
                <Route
                  path="/sets"
                  element={<CostumeSets title={APP_TITLE + "Sets"} />}
                />
                <Route
                  path="/sets/:costumeSetId"
                  element={
                    <CostumeSetDetail title={APP_TITLE + "Set Detail"} />
                  }
                />
                <Route
                  path="/sets/create"
                  element={
                    <CreateCostumeSet title={APP_TITLE + "Create Set"} />
                  }
                />
                <Route
                  path="/sets/edit/:costumeSetId"
                  element={<EditCostumeSet title={APP_TITLE + "Edit Set"} />}
                />
                <Route
                  path="/profile"
                  element={<Profile title={APP_TITLE + "Profile"} />}
                />
                <Route
                  path="/testnav"
                  element={
                    state.user ? (
                      <Navigate to="/"></Navigate>
                    ) : (
                      <Logout title={APP_TITLE + "Logout"}></Logout>
                    )
                  }
                ></Route>
                <Route
                  path="/*"
                  element={<NoMatchPage title={APP_TITLE + "404"} />}
                />
              </Routes>
            </Container>
          </Router>
        </div>
      )}
    </>
  );
};

export default App;
