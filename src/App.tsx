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
        console.log("USER", user);
      } catch (e) {
        // TODO logout user and clear state
        console.error(e);
        console.error("STATE", state);
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
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
