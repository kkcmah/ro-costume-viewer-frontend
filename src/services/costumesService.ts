import axios from "axios";
import { CostumeListRetObj, CostumeURLSearchParams } from "../types";
import authHeaderService from "./authHeaderService";

const baseUrl = "/api/costumes";

const getAll = async (params: CostumeURLSearchParams) => {
  let query = "/params?";
  // construct the url with query params
  for (const [key, value] of Object.entries(params)) {
    if (value !== null) {
      query += `${key}=${encodeURIComponent(value as string)}&`;
    }
  }
  const res = await axios.get<CostumeListRetObj>(`${baseUrl}${query}`);
  return res.data;
};

const favorite = async (costumeId: string) => {
  const res = await axios.post<string[]>(
    `${baseUrl}/favorite`,
    { costumeId },
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

const unfavorite = async (costumeId: string) => {
  const res = await axios.post<string[]>(
    `${baseUrl}/unfavorite`,
    { costumeId },
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

export default { getAll, favorite, unfavorite };
