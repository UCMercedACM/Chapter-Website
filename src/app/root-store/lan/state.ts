import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { LAN } from "../../models";

export interface LANState extends EntityState<LAN> {
    error?: any;
}

export function sortByName(a: LAN, b: LAN): number {
    return a.name.localeCompare(b.name);
}

export const lanAdapter: EntityAdapter<LAN> = createEntityAdapter<LAN>({
    sortComparer: sortByName,
});

export const initialState: LANState = lanAdapter.getInitialState({
    error: null,
});
