import { createSelector, MemoizedSelector } from "@ngrx/store";
import { MemberStoreSelectors } from "./member";

export const selectError: MemoizedSelector<object, string> = createSelector(
  MemberStoreSelectors.selectMemberError,
  (memberError: string) => {
    return memberError;
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
