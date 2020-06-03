import { createAction, props } from "@ngrx/store";

import { Resources } from "src/app/models";

export const loadResourcesSuccess = createAction(
    "[CoffeeNCode] Load Resources Success",
    props<{ data: Resources[] }>()
);

export const loadResourcesFailure = createAction(
    "[CoffeeNCode] Load Resources Failure",
    props<{ error: any }>()
);
