import { createAction, props } from "@ngrx/store";

export const loadMemberStores = createAction("[MemberStore] Load MemberStores");

export const loadMemberStoresSuccess = createAction(
  "[MemberStore] Load MemberStores Success",
  props<{ data: any }>()
);

export const loadMemberStoresFailure = createAction(
  "[MemberStore] Load MemberStores Failure",
  props<{ error: any }>()
);
