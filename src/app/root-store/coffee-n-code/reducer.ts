import { Action, createReducer, on } from "@ngrx/store";

import { initialState, coffeeNCodeAdapter, CoffeeNCodeState } from "./state";
import * as CoffeeNCodeActions from "./actions";

const coffeeNCodeReducer = createReducer(
    initialState,

    on(CoffeeNCodeActions.loadResourcesSuccess, (state, action) => {
        return coffeeNCodeAdapter.addAll(action.data, {
            ...state,
            error: null,
        });
    }),

    on(CoffeeNCodeActions.loadResourcesFailure, (state, action) => {
        return {
            ...state,
            error: action.error,
        };
    })
);

export function reducer(state: CoffeeNCodeState | undefined, action: Action) {
    return coffeeNCodeReducer(state, action);
}
