import { createAction, props } from "@ngrx/store";

import { Auth } from "src/app/models";

export const Authentication = createAction(
  "[Auth] Store Auth Token",
  props<{
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  }>()
);

export const AuthenticationSuccess = createAction(
  "[Auth] Authentication Success",
  props<{ data: Auth }>()
);

export const AuthenticationFailure = createAction(
  "[Auth] Authentication Failure",
  props<{ error: any }>()
);

// Update Access Token Actions

// Update refresh Token Actions
