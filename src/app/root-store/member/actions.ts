import { createAction, props } from "@ngrx/store";
import { Member } from "../../models";

export const loadMembers = createAction("[Member] Load Members");

export const loadMembersSuccess = createAction(
  "[Member] Load Members Success",
  props<{ data: Member[] }>()
);

export const loadMembersFailure = createAction(
  "[Member] Load Members Failure",
  (error = "Error loading members") => ({ error: { error } })
);

export const loadAuth = createAction(
  "[Member] Check if User is in the Database",
  props<{ email: string, password: string }>()
);

export const loadAuthSuccess = createAction(
  "[Member] Log In Success",
  props<{ data: Member[] }>()
);

export const loadAuthFailure = createAction(
  "[Member] Log In Failure",
  props<{ error: any}>()
);


