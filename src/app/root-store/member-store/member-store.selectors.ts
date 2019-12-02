import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from "@ngrx/store";

import { Member } from "../../models/member";

import { memberStoreAdapter, MemberState } from "./member-store.state";

export const getError = (state: MemberState): any => state.error;

export const getIsLoading = (state: MemberState): boolean => state.isLoading;

export const selectMemberState: MemoizedSelector<
  object,
  MemberState
> = createFeatureSelector<MemberState>("member");

export const selectAllMemberItems: (
  state: object
) => Member[] = memberStoreAdapter.getSelectors(selectMemberState).selectAll;

export const selectMemberById = (id: string) =>
  createSelector(this.selectAllMemberItems, (allMembers: Member[]) => {
    if (allMembers) {
      return allMembers.find(p => p.id === id);
    } else {
      return null;
    }
  });

export const selectMemberError: MemoizedSelector<
  object,
  any
> = createSelector(selectMemberState, getError);

export const selectMemberIsLoading: MemoizedSelector<
  object,
  boolean
> = createSelector(selectMemberState, getIsLoading);
