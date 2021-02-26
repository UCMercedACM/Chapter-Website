import { Action, createReducer, on } from "@ngrx/store";

import { initialState, memberAdapter, MemberState } from "./state";
import * as MemberActions from "./actions";

const memberReducer = createReducer(
    initialState,

    on(MemberActions.loginAuthentication, (state, action) => {
        return { ...state, isLoading: true, error: null };
    }),

    on(MemberActions.loginAuthenticationSuccess, (state, action) => {
        return memberAdapter.addOne(action.data, {
            ...state,
            selectedMemberId: action.data.id,
            isLoading: false,
            error: null,
            isAuthenticated: true,
            isLoggedIn: true,
        });
    }),

    on(MemberActions.loginAuthenticationFailure, (state, action) => {
        return {
            ...state,
            isLoading: false,
            error: action.error,
            isAuthenticated: false,
        };
    }),

    on(MemberActions.signUpAuthentication, (state, action) => {
        return { ...state, isLoading: true, error: null };
    }),

    on(MemberActions.signUpAuthenticationSuccess, (state, action) => {
        return memberAdapter.addOne(action.data, {
            ...state,
            selectedMemberId: action.data.id,
            isLoading: false,
            error: null,
            isAuthenticated: true,
            isLoggedIn: true,
        });
    }),

    on(MemberActions.signUpAuthenticationFailure, (state, action) => {
        return {
            ...state,
            isLoading: false,
            error: action.error,
            isAuthenticated: false,
        };
    })
);

export function reducer(state: MemberState | undefined, action: Action) {
    return memberReducer(state, action);
}
