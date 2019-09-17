import { combineReducers } from "redux";
import { updateUserSessionReducer } from "./user.reducer";
import { updateScreenReducer } from "./screen.reducer";

interface Role {
    id: number;
    role: string;
}

export interface IUserState {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: Role,
    token: string
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
