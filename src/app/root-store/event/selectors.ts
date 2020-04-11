import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
  } from "@ngrx/store";
  
  import { Event } from "../../models";
  import { eventAdapter, EventState } from "./state";
  import { reducer } from "./reducer";
  
  export interface State {
    events: EventState;
  }
  
  export const reducers: ActionReducerMap<State> = {
    events: reducer
  };
  
  export const selectEventState = createFeatureSelector<EventState>("event");
  
  export const selectAllEventItems: (
    state: object
  ) => Event[] = eventAdapter.getSelectors(selectEventState).selectAll;
  
  export const selectEventById = (id: number) =>
    createSelector(this.selectAllEventItems, (allEvents: Event[]) => {
      if (allEvents) {
        return allEvents.find(p => p.id === id);
      } else {
        return null;
      }
    });
  
  export const getIsLoading = (state: EventState): boolean => state.isLoading;
  export const selectEventIsLoading = createSelector(selectEventState, getIsLoading);
  
  export const getError = (state: EventState): any => state.error;
  export const selectEventError = createSelector(selectEventState, getError);
  