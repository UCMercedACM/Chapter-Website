import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { TechnicalInterviewQuestions } from "../../models";
import { kodingKataAdapter, KodingKataState } from "./state";
import { reducer } from "./reducer";

export interface State {
    technicalInterviewQuestions: KodingKataState;
}

export const reducers: ActionReducerMap<State> = {
    technicalInterviewQuestions: reducer,
};

export const selectKodingKataState = createFeatureSelector<KodingKataState>(
    "koding-kata"
);

export const selectAllTechnicalInterviewQuestionItems: (
    state: object
) => TechnicalInterviewQuestions[] = kodingKataAdapter.getSelectors(
    selectKodingKataState
).selectAll;

export const selectTechnicalInterviewQuestionByName = (name: string) =>
    createSelector(
        this.selectAllKodingKataItems,
        (allTechnicalInterviewQuestions: TechnicalInterviewQuestions[]) => {
            if (allTechnicalInterviewQuestions) {
                return allTechnicalInterviewQuestions.find(
                    (p) => p.name === name
                );
            } else {
                return null;
            }
        }
    );

export const getError = (state: KodingKataState): any => state.error;
export const selectKodingKataError = createSelector(
    selectKodingKataState,
    getError
);
