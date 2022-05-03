import { State } from "./state";
import { User } from "../types";

export enum Types {
  SET_USER = "SET_USER",
  SET_FAV_COSTUMES = "SET_FAV_COSTUMES",
  SET_LIKED_SETS = "SET_LIKED_SETS",
}

export type Action =
  | {
      type: Types.SET_USER;
      payload: User | null;
    }
  | {
      type: Types.SET_FAV_COSTUMES;
      payload: string[];
    }
  | {
      type: Types.SET_LIKED_SETS;
      payload: string[];
    };

export const setUser = (user: User | null): Action => {
  return {
    type: Types.SET_USER,
    payload: user,
  };
};

export const setFavCostumes = (costumeIds: string[]): Action => {
  return { type: Types.SET_FAV_COSTUMES, payload: costumeIds };
};

export const setLikedSets = (costumeSetIds: string[]): Action => {
  return { type: Types.SET_LIKED_SETS, payload: costumeSetIds };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Types.SET_USER:
      return { ...state, user: action.payload };
    case Types.SET_FAV_COSTUMES: {
      if (state.user) {
        return {
          ...state,
          user: {
            ...state.user,
            favCostumes: action.payload,
          },
        };
      }
      return state;
    }
    case Types.SET_LIKED_SETS: {
      if (state.user) {
        return {
          ...state,
          user: {
            ...state.user,
            likedCostumeSets: action.payload,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
};
