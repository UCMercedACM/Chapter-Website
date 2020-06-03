import { Action, createReducer, on } from "@ngrx/store";

import { initialState, kodingKataAdapter, KodingKataState } from "./state";
import * as KodingKataActions from "./actions";

const kodingKataReducer = createReducer(
    initialState,

    on(
        KodingKataActions.loadTechnicalInterviewQuestionsSuccess,
        (state, action) => {
            return kodingKataAdapter.addAll(action.data, {
                ...state,
                error: null,
            });
        }
    ),

    on(
        KodingKataActions.loadTechnicalInterviewQuestionsFailure,
        (state, action) => {
            return {
                ...state,
                error: action.error,
            };
        }
    )
);

export function reducer(state: KodingKataState | undefined, action: Action) {
    return kodingKataReducer(state, action);
}
