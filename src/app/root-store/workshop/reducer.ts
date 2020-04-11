import { Action, createReducer, on } from "@ngrx/store";

import { initialState, workshopAdapter, WorkshopState } from "./state";
import * as WorkshopActions from "./actions";

const workshopReducer = createReducer(
  initialState,

  on(WorkshopActions.loadWorkshops, (state, action) => {
    return { ...state, isLoading: true, error: null };
  }),

  on(WorkshopActions.loadWorkshopsSuccess, (state, action) => {
    return workshopAdapter.addAll(action.data, {
      ...state,
      isLoading: false,
      error: null,
    });
  }),

  on(WorkshopActions.loadWorkshopsFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error,
    };
  })
);

export function reducer(state: WorkshopState | undefined, action: Action) {
  return workshopReducer(state, action);
}
