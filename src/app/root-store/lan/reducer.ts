import { Action, createReducer, on } from "@ngrx/store";

import { initialState, lanAdapter, LANState } from "./state";
import * as LANActions from "./actions";

const lanReducer = createReducer(
    initialState,

    on(LANActions.loadLANPartySuccess, (state, action) => {
        return lanAdapter.addAll(action.data, {
            ...state,
            error: null,
        });
    }),

    on(LANActions.loadLANPartyFailure, (state, action) => {
        return {
            ...state,
            error: action.error,
        };
    })
);

export function reducer(state: LANState | undefined, action: Action) {
    return lanReducer(state, action);
}
