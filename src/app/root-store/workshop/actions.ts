import { createAction, props } from "@ngrx/store";

import { Workshop } from "src/app/models";

export const loadWorkshops = createAction(
  "[Workshop] Initialize Loading Workshops"
);

export const loadWorkshopsSuccess = createAction(
  "[Workshop] Load Workshops Success",
  props<{ data: Workshop[] }>()
);

export const loadWorkshopsFailure = createAction(
  "[Workshop] Load Workshops Failure",
  props<{ error: any }>()
);
