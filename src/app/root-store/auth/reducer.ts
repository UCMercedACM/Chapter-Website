import { Action, createReducer, on } from "@ngrx/store";

import { initialState } from "./state";
import * as AuthActions from "./actions";
import { Auth } from 'src/app/models';

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

export function reducer(state: Auth | undefined, action: Action) {
  return authReducer(state, action);
}
