import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { Resources } from "../../models";
import { coffeeNCodeAdapter, CoffeeNCodeState } from "./state";
import { reducer } from "./reducer";

export interface State {
    resources: CoffeeNCodeState;
}

export const reducers: ActionReducerMap<State> = {
    resources: reducer,
};

export const selectCoffeeNCodeState = createFeatureSelector<CoffeeNCodeState>(
    "coffee-n-code"
);

export const selectAllCoffeeNCodeItems: (
    state: object
) => Resources[] = coffeeNCodeAdapter.getSelectors(selectCoffeeNCodeState)
    .selectAll;

export const selectCoffeeNCodeByName = (name: string) =>
    createSelector(
        this.selectAllCoffeeNCodeItems,
        (allResources: Resources[]) => {
            if (allResources) {
                return allResources.find((p) => p.name === name);
            } else {
                return null;
            }
        }
    );

export const getError = (state: CoffeeNCodeState): any => state.error;
export const selectCoffeeNCodeError = createSelector(
    selectCoffeeNCodeState,
    getError
);
