import { createAction, props } from "@ngrx/store";

import { Event } from "src/app/models";

export const loadEventsSuccess = createAction(
  "[Event] Load Events Success",
  props<{ data: Event[] }>()
);

export const loadEventsFailure = createAction(
  "[Event] Load Events Failure",
  props<{ error: any }>()
);
