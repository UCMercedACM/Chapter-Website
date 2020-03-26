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
  }),

  on(MemberActions.loadAuth, (state, action) => {
    return { ...state, isLoading: true, error: null };
  }),

  on(MemberActions.loadAuthSuccess, (state, action) => {
    // return {
    //    ...state,
    //    isLoading: false,
    //    error: null,
    //    isAuthenticated: true
    // };
    return memberAdapter.addOne(action.data, {
         ...state,
         isLoading: false,
         error: null,
         isAuthenticated: true
      });
  }),

  on(MemberActions.loadAuthFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error,
      isAuthenticated: false
    };
  }),

);

export function reducer(state: MemberState | undefined, action: Action) {
  return memberReducer(state, action);
}
