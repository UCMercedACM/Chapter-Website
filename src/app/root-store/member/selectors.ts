import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from "@ngrx/store";

import { Member } from "../../models";

import { memberAdapter, State } from "./state";

export const getError = (state: State): any => state.error;

export const getIsLoading = (state: State): boolean => state.isLoading;

export const selectMemberState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>("member");

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

export const selectMemberError: MemoizedSelector<
  object,
  any
> = createSelector(selectMemberState, getError);

export const selectMemberIsLoading: MemoizedSelector<
  object,
  boolean
> = createSelector(selectMemberState, getIsLoading);
