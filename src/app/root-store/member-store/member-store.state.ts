import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { Member } from "../../models/member";

export interface MemberState extends EntityState<Member> {
  // additional entities state properties
  selectedMemberId: number;
  isLoading?: boolean;
  error?: any;
}

export function selectedMemberId(a: Member): string {
  // In this case this would be optional since primary key is id
  return a.id;
}

export function sortByName(a: Member, b: Member): number {
  return a.firstName.localeCompare(b.firstName);
}

export const memberStoreAdapter: EntityAdapter<Member> = createEntityAdapter<
  Member
>({
  selectId: selectedMemberId,
  sortComparer: sortByName
});

export const initialState: MemberState = memberStoreAdapter.getInitialState({
  selectedMemberId: null,
  isLoading: false,
  error: null
});
