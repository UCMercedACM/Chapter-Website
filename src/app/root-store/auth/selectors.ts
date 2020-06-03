import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap,
} from "@ngrx/store";

import { reducer } from "./reducer";
import { Auth } from "src/app/models";

export interface State {
  auth: Auth;
}

export const reducers: ActionReducerMap<State> = {
  auth: reducer,
};

export const selectAuthState = createFeatureSelector<Auth>("auth");

export const getAccessToken = (state: Auth): string => state.accessToken;
export const selectAccessToken = createSelector(
  selectAuthState,
  getAccessToken
);

export const getRefreshToken = (state: Auth): string => state.refreshToken;
export const selectRefreshToken = createSelector(
  selectAuthState,
  getRefreshToken
);

export const getExpiresIn = (state: Auth): string => state.expiresIn;
export const selectExpiresIn = createSelector(selectAuthState, getExpiresIn);
