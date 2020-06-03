import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { CTFMeetings } from "../../models";

export interface CTFState extends EntityState<CTFMeetings> {
    error?: any;
}

export function sortByName(a: CTFMeetings, b: CTFMeetings): number {
    return a.name.localeCompare(b.name);
}

export const ctfAdapter: EntityAdapter<CTFMeetings> = createEntityAdapter<CTFMeetings>({
    sortComparer: sortByName,
});

export const initialState: CTFState = ctfAdapter.getInitialState({
    error: null,
});
