import { Action } from "@ngrx/store";
import { Member } from "../../models";

export enum ActionTypes {
  LOAD_REQUEST = "[My Feature] Load Request",
  LOAD_FAILURE = "[My Feature] Load Failure",
  LOAD_SUCCESS = "[My Feature] Load Success"
}

export class LoadRequestAction implements Action {
  readonly type = ActionTypes.LOAD_REQUEST;
}

export class LoadFailureAction implements Action {
  readonly type = ActionTypes.LOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class LoadSuccessAction implements Action {
  readonly type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: { items: Member[] }) {}
}

export type Actions = LoadRequestAction | LoadFailureAction | LoadSuccessAction;
