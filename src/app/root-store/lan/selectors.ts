import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { LAN } from "../../models";
import { lanAdapter, LANState } from "./state";
import { reducer } from "./reducer";

export interface State {
    lan: LANState;
}

export const reducers: ActionReducerMap<State> = {
    lan: reducer,
};

export const selectLANState = createFeatureSelector<LANState>("lan");

export const selectAllLANItems: (
    state: object
) => LAN[] = lanAdapter.getSelectors(selectLANState).selectAll;

export const selectLANByName = (name: string) =>
    createSelector(this.selectAllLANItems, (allLANParties: LAN[]) => {
        if (allLANParties) {
            return allLANParties.find((p) => p.name === name);
        } else {
            return null;
        }
    });

export const getError = (state: LANState): any => state.error;
export const selectLANError = createSelector(selectLANState, getError);
