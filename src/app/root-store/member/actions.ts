import { createAction, props } from "@ngrx/store";

import { Member } from "src/app/models";

export const loginAuthentication = createAction(
    "[Member] Check if User is in the Database",
    props<{ email: string; password: string }>()
);

export const loginAuthenticationSuccess = createAction(
    "[Member] Log In Success",
    props<{ data: Member }>()
);

export const loginAuthenticationFailure = createAction(
    "[Member] Log In Failure",
    props<{ error: any }>()
);
