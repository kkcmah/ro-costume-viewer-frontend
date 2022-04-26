import React, { createContext, useReducer } from "react";
import { User } from "../types";
import { Action, reducer } from "./reducer";

export type State = {
  user: User | null;
};

const initialState: State = {
  user: null,
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

type StateProviderProps = {
  children: React.ReactElement;
};

export const StateProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
