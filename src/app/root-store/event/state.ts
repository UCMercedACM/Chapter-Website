import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Event } from "../../models";

export interface EventState extends EntityState<Event> {
  isLoading?: boolean;
  error?: any;
}

export function sortByName(a: Event, b: Event): number {
  return a.name.localeCompare(b.name);
}

export const eventAdapter: EntityAdapter<Event> = createEntityAdapter<
  Event
>({
  sortComparer: sortByName,
});

export const initialState: EventState = eventAdapter.getInitialState({
  isLoading: false,
  error: null,
});
