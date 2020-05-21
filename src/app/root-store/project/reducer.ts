import { Action, createReducer, on } from "@ngrx/store";

import { initialState, projectAdapter, ProjectState } from "./state";
import * as ProjectActions from "./actions";

const projectReducer = createReducer(
    initialState,

    on(ProjectActions.loadProjectsSuccess, (state, action) => {
        return projectAdapter.addAll(action.data, {
            ...state,
            error: null,
        });
    }),

    on(ProjectActions.loadProjectsFailure, (state, action) => {
        return {
            ...state,
            error: action.error,
        };
    })
);

export function reducer(state: ProjectState | undefined, action: Action) {
    return projectReducer(state, action);
}
