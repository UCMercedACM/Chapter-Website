import { Action, createReducer, on } from "@ngrx/store";

import { initialState, eventAdapter, EventState } from "./state";
import * as EventActions from "./actions";

const eventReducer = createReducer(
    initialState,

    on(EventActions.loadEventsSuccess, (state, action) => {
        return eventAdapter.addAll(action.data, {
            ...state,
            error: null,
        });
    }),

    on(EventActions.loadEventsFailure, (state, action) => {
        return {
            ...state,
            error: action.error,
        };
    })
);

export function reducer(state: EventState | undefined, action: Action) {
    return eventReducer(state, action);
}
