import axios from "axios";
import {
  CostumeSet,
  CostumeSetsPagedParams,
  CostumeSetsWithCount,
  NewCostumeSet,
} from "../types";
import authHeaderService from "./authHeaderService";

const baseUrl = "/api/costumeSets";

const getAll = async (params: CostumeSetsPagedParams) => {
  const res = await axios.post<CostumeSetsWithCount>(`${baseUrl}/params`, {
    ...params,
  });
  return res.data;
};

const getAllLikedPubOrOwn = async (params: CostumeSetsPagedParams) => {
  const res = await axios.post<CostumeSetsWithCount>(
    `${baseUrl}/profileliked/params`,
    {
      ...params,
    },
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

const getAllOwned = async (params: CostumeSetsPagedParams) => {
  const res = await axios.post<CostumeSetsWithCount>(
    `${baseUrl}/owned/params`,
    {
      ...params,
    },
    authHeaderService.getAuthHeader()
  );
  return res.data;
};

const getPublicById = async (costumeSetId: string) => {
  const res = await axios.get<CostumeSet>(`${baseUrl}/${costumeSetId}`);
  return res.data;
};

const getOwnedById = async (costumeSetId: string) => {
  const res = await axios.get<CostumeSet>(
    `${baseUrl}/owned/${costumeSetId}`,
    authHeaderService.getAuthHeader()
  );
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

const editSet = async (newCostumeSet: NewCostumeSet, costumeSetId: string) => {
  const res = await axios.patch<CostumeSet>(
    `${baseUrl}/${costumeSetId}`,
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

export default {
  getAll,
  getAllLikedPubOrOwn,
  getAllOwned,
  getPublicById,
  getOwnedById,
  createSet,
  editSet,
  deleteSet,
  likeSet,
  unlikeSet,
  updateSet,
};
