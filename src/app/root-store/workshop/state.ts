import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Workshop } from "../../models";

export interface WorkshopState extends EntityState<Workshop> {
  isLoading?: boolean;
  error?: any;
}

export function sortByName(a: Workshop, b: Workshop): number {
  return a.name.localeCompare(b.name);
}

export const workshopAdapter: EntityAdapter<Workshop> = createEntityAdapter<
  Workshop
>({
  sortComparer: sortByName,
});

export const initialState: WorkshopState = workshopAdapter.getInitialState({
  isLoading: false,
  error: null,
});
