import { combineReducers } from "redux";
import { updateUserSessionReducer } from "./user.reducer";
import { updateScreenReducer } from "./screen.reducer";

export interface IUserState {
    loggedIn: boolean,
    name: string
}

export interface IScreenState {
    isLargeScreen: boolean
}

// Combination of all states
export interface IState {
    user: IUserState,
    ui: IScreenState
}

export const state = combineReducers<IState>({
    user: updateUserSessionReducer,
    ui: updateScreenReducer
})