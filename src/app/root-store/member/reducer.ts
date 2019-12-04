import { Action, createReducer, on } from "@ngrx/store";

import { initialState, memberAdapter, MemberState } from "./state";
import * as MemberActions from "./actions";

const memberReducer = createReducer(
  initialState,

  on(MemberActions.loadMembers, state => {
    return { ...state, isLoading: true, error: null };
  }),
  on(MemberActions.loadMembersSuccess, (state, action) => {
    return memberAdapter.addAll(action.data, {
      ...state,
      isLoading: false,
      error: null
    });
  }),
  on(MemberActions.loadMembersFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error
    };
  })
);

export function reducer(state: MemberState | undefined, action: Action) {
  return memberReducer(state, action);
}
