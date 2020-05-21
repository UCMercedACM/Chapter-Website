import { createSelector, MemoizedSelector } from "@ngrx/store";

import { MemberStoreSelectors } from "./member";
import { CoffeeNCodeStoreSelectors } from "./coffee-n-code";
import { EventStoreSelectors } from "./event";
import { KodingKataStoreSelectors } from "./koding-kata";
import { LANStoreSelectors } from "./lan";
import { ProjectStoreSelectors } from "./project";
import { WorkshopStoreSelectors } from "./workshop";

export const selectError: MemoizedSelector<object, string> = createSelector(
    MemberStoreSelectors.selectMemberError,
    CoffeeNCodeStoreSelectors.selectCoffeeNCodeError,
    EventStoreSelectors.selectEventError,
    KodingKataStoreSelectors.selectKodingKataError,
    LANStoreSelectors.selectLANError,
    ProjectStoreSelectors.selectProjectError,
    WorkshopStoreSelectors.selectWorkshopError,
    (
        memberError: string,
        coffeeNCodeError: string,
        eventError: string,
        kodingKataError: string,
        lanError: string,
        projectError: string,
        workshopError: string
    ) => {
        return (
            memberError ||
            coffeeNCodeError ||
            eventError ||
            kodingKataError ||
            lanError ||
            projectError ||
            workshopError
        );
    }
);

export const selectIsLoading: MemoizedSelector<
    object,
    boolean
> = createSelector(
    MemberStoreSelectors.selectMemberIsLoading,
    (member: boolean) => {
        return member;
    }
);
