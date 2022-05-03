import axios from "axios";
import { CostumeSet, NewCostumeSet } from "../types";
import authHeaderService from "./authHeaderService";

const baseUrl = "/api/costumeSets";

const getAll = async (name = "", lastSeenId = "") => {
  console.log("get NAME", name);
  console.log("get SEEN", lastSeenId);
  const res = await axios.get<CostumeSet[]>(`${baseUrl}`);
  return res.data;
};

const createSet = async (newCostumeSet: NewCostumeSet) => {
  const res = await axios.post<CostumeSet>(
    `${baseUrl}`,
    newCostumeSet,
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

const deleteSet = async (delCostumeSetId: string) => {
  const res = await axios.delete<{ message: string }>(
    `${baseUrl}/${delCostumeSetId}`,
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

const likeSet = async (costumeSetId: string) => {
  const res = await axios.post<string[]>(
    `${baseUrl}/${costumeSetId}/like`,
    { costumeSetId },
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

const unlikeSet = async (costumeSetId: string) => {
  const res = await axios.post<string[]>(
    `${baseUrl}/${costumeSetId}/unlike`,
    { costumeSetId },
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

const updateSet = async (
  costumeSetId: string,
  updatedCostumeSet: NewCostumeSet
) => {
  const res = await axios.patch<CostumeSet>(
    `${baseUrl}/${costumeSetId}`,
    updatedCostumeSet,
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

export default { getAll, createSet, deleteSet, likeSet, unlikeSet, updateSet };
