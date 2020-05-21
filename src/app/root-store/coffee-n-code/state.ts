import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Resources } from "../../models";

export interface CoffeeNCodeState extends EntityState<Resources> {
    error?: any;
}

export function sortByName(a: Resources, b: Resources): number {
    return a.name.localeCompare(b.name);
}

export const coffeeNCodeAdapter: EntityAdapter<Resources> = createEntityAdapter<
    Resources
>({
    sortComparer: sortByName,
});

export const initialState: CoffeeNCodeState = coffeeNCodeAdapter.getInitialState(
    {
        error: null,
    }
);
