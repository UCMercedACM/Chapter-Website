import { createAction, props } from "@ngrx/store";
import { Member } from "../../models";
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';

export const loadMembers = createAction("[Member] Load Members");

export const loadMembersSuccess = createAction(
  "[Member] Load Members Success",
  props<{ data: Member[] }>()
);

export const loadMembersFailure = createAction(
  "[Member] Load Members Failure",
  props<{ error: any }>()
);

export enum AuthActionTypes{
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
}

export class LogIn implements CreateAction


