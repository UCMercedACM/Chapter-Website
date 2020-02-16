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
  members: reducer
};

export const selectMemberState = createFeatureSelector<MemberState>("member");

export const getSelectedMemberId = (state: MemberState) => state.selectedMemberId;

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = memberAdapter.getSelectors();

export const getMembers = createSelector(
  selectMemberState,
  props => props
);

// select the array of member ids
export const selectMemberIds = createSelector(
  selectMemberState,
  selectIds // shorthand for MemberState => fromUser.selectMemberIds(MemberState)
);

// select the dictionary of member entities
export const selectMemberEntities = createSelector(
  selectMemberState,
  selectEntities
);

// select the array of members
export const selectAllMembers = createSelector(
  selectMemberState,
  selectAll
);

// select the total member count
export const selectMemberTotal = createSelector(
  selectMemberState,
  selectTotal
);

export const selectCurrentMemberId = createSelector(
  selectMemberState,
  getSelectedMemberId
);

export const selectCurrentMember = createSelector(
  selectMemberEntities,
  selectCurrentMemberId,
  (memberEntities, memberId) => memberEntities[memberId]
);

export const selectAllMemberItems: (
  state: object
) => Member[] = memberAdapter.getSelectors(selectMemberState).selectAll;

export const selectMemberById = (id: number) =>
  createSelector(this.selectAllMemberItems, (allMembers: Member[]) => {
    if (allMembers) {
      return allMembers.find(p => p.id === id);
    } else {
      return null;
    }
  });

export const getIsLoading = (state: MemberState): boolean => state.isLoading;
export const selectMemberIsLoading = createSelector(selectMemberState, getIsLoading);

export const getError = (state: MemberState): any => state.error;
export const selectMemberError = createSelector(selectMemberState, getError);
