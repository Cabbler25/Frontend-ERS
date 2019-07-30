import { combineReducers } from "redux";
import { updateUserSessionReducer } from "./reducers";

export interface IUserState {
    loggedIn: boolean,
    name: string
}

// Combination of all states
export interface IState {
    user: IUserState
}

export const state = combineReducers<IState>({
    user: updateUserSessionReducer
})