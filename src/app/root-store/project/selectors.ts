import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { Project } from "../../models";
import { projectAdapter, ProjectState } from "./state";
import { reducer } from "./reducer";

export interface State {
    project: ProjectState;
}

export const reducers: ActionReducerMap<State> = {
    project: reducer,
};

export const selectProjectState = createFeatureSelector<ProjectState>(
    "project"
);

export const selectAllProjectItems: (
    state: object
) => Project[] = projectAdapter.getSelectors(selectProjectState).selectAll;

export const selectProjectByName = (name: string) =>
    createSelector(
        this.selectAllProjectItems,
        (allProjectParties: Project[]) => {
            if (allProjectParties) {
                return allProjectParties.find((p) => p.name === name);
            } else {
                return null;
            }
        }
    );

export const getError = (state: ProjectState): any => state.error;
export const selectProjectError = createSelector(selectProjectState, getError);
