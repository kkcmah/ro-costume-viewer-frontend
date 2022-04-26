import { State } from "./state";
import { User } from "../types";

export enum Types {
  SET_USER = "SET_USER",
}

export type Action = {
  type: Types.SET_USER;
  payload: User | null;
};

export const setUser = (user: User | null): Action => {
  return {
    type: Types.SET_USER,
    payload: user,
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Types.SET_USER:
      return {...state, user: action.payload};
    default:
      return state;
  }
};
