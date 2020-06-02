import { Action, createReducer, on } from "@ngrx/store";

import { initialState, AuthState } from "./state";
import * as AuthActions from "./actions";

const authReducer = createReducer(
  initialState,

  on(AuthActions.Authentication, (state, _action) => {
    return { ...state, isLoading: true, error: null };
  }),

  on(AuthActions.AuthenticationSuccess, (state, action) => {
    return {
      ...state,
      ...action.data,
      isLoading: false,
      error: null,
    };
  }),

  on(AuthActions.AuthenticationFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error,
    };
  })
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
