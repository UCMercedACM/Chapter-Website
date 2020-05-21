import {
    createFeatureSelector,
    createSelector,
    ActionReducerMap,
} from "@ngrx/store";

import { Member } from "../../models";
import { memberAdapter, MemberState } from "./state";
import { reducer } from "./reducer";

export interface State {
    members: MemberState;
}

export const reducers: ActionReducerMap<State> = {
    members: reducer,
};

export const selectMemberState = createFeatureSelector<MemberState>("member");

export const getSelectedMemberId = (state: MemberState): number =>
    state.selectedMemberId;
export const selectSelectedMemberId = createSelector(
    selectMemberState,
    getSelectedMemberId
);

export const getIsLoggedIn = (state: MemberState): boolean => state.isLoggedIn;
export const selectMemberIsLoggedIn = createSelector(
    selectMemberState,
    getIsLoggedIn
);

export const selectAllMemberItems: (
    state: object
) => Member[] = memberAdapter.getSelectors(selectMemberState).selectAll;

export const selectMemberById = (id: number) =>
    createSelector(this.selectAllMemberItems, (allMembers: Member[]) => {
        if (allMembers) {
            return allMembers.find((p) => p.id === id);
        } else {
            return null;
        }
    });

export const getIsLoading = (state: MemberState): boolean => state.isLoading;
export const selectMemberIsLoading = createSelector(
    selectMemberState,
    getIsLoading
);

export const getError = (state: MemberState): any => state.error;
export const selectMemberError = createSelector(selectMemberState, getError);
