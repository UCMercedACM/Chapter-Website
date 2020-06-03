import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Project } from "../../models";

export interface ProjectState extends EntityState<Project> {
    error?: any;
}

export function sortByName(a: Project, b: Project): number {
    return a.name.localeCompare(b.name);
}

export const projectAdapter: EntityAdapter<Project> = createEntityAdapter<
    Project
>({
    sortComparer: sortByName,
});

export const initialState: ProjectState = projectAdapter.getInitialState({
    error: null,
});
