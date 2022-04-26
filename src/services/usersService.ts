import axios from "axios";
import { User, UserLoginCreds } from "../types";
import authHeaderService from "./authHeaderService";

const baseUrl = "/api/users";

const loadUserLocalStorage = async () => {
  const tokenLS = localStorage.getItem("user");
  if (tokenLS) {
    authHeaderService.setToken(tokenLS);
    const res = await axios.get<User>(
      `${baseUrl}/self`,
      authHeaderService.getAuthHeader()
    );
    return res.data;
  }
  return null;
};

const signUp = async (creds: UserLoginCreds) => {
  const res = await axios.post<User>(`${baseUrl}`, creds);
  return res.data;
};

export default { loadUserLocalStorage, signUp };
