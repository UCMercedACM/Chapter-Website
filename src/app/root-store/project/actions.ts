import { createAction, props } from "@ngrx/store";

import { Project } from "src/app/models";

export const loadProjectsSuccess = createAction(
    "[Project] Load Projects Success",
    props<{ data: Project[] }>()
);

export const loadProjectsFailure = createAction(
    "[Project] Load Projects Failure",
    props<{ error: any }>()
);
