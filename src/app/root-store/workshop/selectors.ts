import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { Workshop } from "../../models";
import { workshopAdapter, WorkshopState } from "./state";
import { reducer } from "./reducer";

export interface State {
    workshops: WorkshopState;
}

export const reducers: ActionReducerMap<State> = {
    workshops: reducer,
};

export const selectWorkshopState = createFeatureSelector<WorkshopState>(
    "workshop"
);

export const selectAllWorkshopItems: (
    state: object
) => Workshop[] = workshopAdapter.getSelectors(selectWorkshopState).selectAll;

export const selectWorkshopById = (id: number) =>
    createSelector(this.selectAllWorkshopItems, (allWorkshops: Workshop[]) => {
        if (allWorkshops) {
            return allWorkshops.find((p) => p.id === id);
        } else {
            return null;
        }
    });

export const getError = (state: WorkshopState): any => state.error;
export const selectWorkshopError = createSelector(
    selectWorkshopState,
    getError
);
