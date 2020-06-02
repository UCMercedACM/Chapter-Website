import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { AuthState } from "./state";
import { reducer } from "./reducer";

export interface State {
    auth: AuthState;
}

export const reducers: ActionReducerMap<State> = {
    auth: reducer,
};

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const getIsLoading = (state: AuthState): boolean => state.isLoading;
export const selectAuthIsLoading = createSelector(
    selectAuthState,
    getIsLoading
);

export const getError = (state: AuthState): any => state.error;
export const selectAuthError = createSelector(selectAuthState, getError);
