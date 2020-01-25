import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Member } from "../../models";

export const memberFeatureKey = "member";

export interface MemberState extends EntityState<Member> {
  // additional entities state properties
  selectedMemberId: number;
  isLoading?: boolean;
  error?: any;
  isAuthenticated?: boolean;
}

export function selectedMemberId(a: Member): number {
  // In this case this would be optional since primary key is id
  return a.id;
}

export function sortByEmail(a: Member, b: Member): number {
  return a.email.localeCompare(b.email);
}

export const memberAdapter: EntityAdapter<Member> = createEntityAdapter<Member>(
  {
    selectId: selectedMemberId,
    sortComparer: sortByEmail
  }
);

export const initialState: MemberState = memberAdapter.getInitialState({
  selectedMemberId: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
});
