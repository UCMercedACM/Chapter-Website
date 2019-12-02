import { Action, createReducer, on } from "@ngrx/store";

import { MemberState, initialState, memberStoreAdapter } from "./member-store.state";
import * as MemberStoreActions from "./member-store.actions";

export const memberStoreFeatureKey = "memberStore";

const memberStoreReducer = createReducer(
  initialState,

  on(MemberStoreActions.loadMemberStores, state => {
    return { ...state, isLoading: true, error: null };
  }),
  on(MemberStoreActions.loadMemberStoresSuccess, (state, action) => {
    return memberStoreAdapter.addAll(action.data, {
      ...state,
      isLoading: false,
      error: null
    });
  }),
  on(MemberStoreActions.loadMemberStoresFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error
    };
  })
);

export function reducer(state: MemberState | undefined, action: Action) {
  return memberStoreReducer(state, action);
}
