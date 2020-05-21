import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { CTFMeetings } from "../../models";
import { ctfAdapter, CTFState } from "./state";
import { reducer } from "./reducer";

export interface State {
    events: CTFState;
}

export const reducers: ActionReducerMap<State> = {
    events: reducer,
};

export const selectCTFState = createFeatureSelector<CTFState>("ctf");

export const selectAllCTFMeetingItems: (
    state: object
) => CTFMeetings[] = ctfAdapter.getSelectors(selectCTFState).selectAll;

export const selectCTFMeetingById = (name: string) =>
    createSelector(
        this.selectAllCTFMeetingItems,
        (allCTFMeetings: CTFMeetings[]) => {
            if (allCTFMeetings) {
                return allCTFMeetings.find((p) => p.name === name);
            } else {
                return null;
            }
        }
    );

export const getError = (state: CTFState): any => state.error;
export const selectCTFError = createSelector(selectCTFState, getError);
