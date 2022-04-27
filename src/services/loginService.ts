import axios from "axios";
import { UserLoginCreds, UserWithToken } from "../types";
import authHeaderService from "./authHeaderService";

const baseUrl = "/api/login";

const ping = async () => {
  const res = await axios.get<string>(`${baseUrl}/ping`);
  return res.data;
};

const login = async (creds: UserLoginCreds) => {
  const res = await axios.post<UserWithToken>(baseUrl, creds);
  localStorage.setItem("user", res.data.token);
  authHeaderService.setToken(res.data.token);
  return res.data;
};

const logout = () => {
  authHeaderService.setToken("");
  localStorage.removeItem("user");
};

export default { ping, login, logout };
