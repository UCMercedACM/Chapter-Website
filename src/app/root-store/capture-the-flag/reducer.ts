import { Action, createReducer, on } from "@ngrx/store";

import { initialState, ctfAdapter, CTFState } from "./state";
import * as CTFActions from "./actions";

const ctfReducer = createReducer(
    initialState,

    on(CTFActions.loadCTFMeetingsSuccess, (state, action) => {
        return ctfAdapter.addAll(action.data, {
            ...state,
            error: null,
        });
    }),

    on(CTFActions.loadCTFMeetingsFailure, (state, action) => {
        return {
            ...state,
            error: action.error,
        };
    })
);

export function reducer(state: CTFState | undefined, action: Action) {
    return ctfReducer(state, action);
}
