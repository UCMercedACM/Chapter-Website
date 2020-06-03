import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { TechnicalInterviewQuestions } from "../../models";

export interface KodingKataState
    extends EntityState<TechnicalInterviewQuestions> {
    error?: any;
}

export function sortByName(
    a: TechnicalInterviewQuestions,
    b: TechnicalInterviewQuestions
): number {
    return a.name.localeCompare(b.name);
}

export const kodingKataAdapter: EntityAdapter<TechnicalInterviewQuestions> = createEntityAdapter<
    TechnicalInterviewQuestions
>({
    sortComparer: sortByName,
});

export const initialState: KodingKataState = kodingKataAdapter.getInitialState({
    error: null,
});
