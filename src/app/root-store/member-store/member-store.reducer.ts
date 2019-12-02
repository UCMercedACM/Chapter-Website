import { Action, createReducer, on, State } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as MemberStoreActions from './member-store.actions';
import { Member } from '../../models/member';

export const memberStoreFeatureKey = 'memberStore';

export interface MemberState extends EntityState<Member> {
  // additional entities state properties
  selectedMemberId: number;
  isLoading?: boolean;
  error?: any;
}

export function selectedMemberId(a: Member): string {
  //In this case this would be optional since primary key is id
  return a.id;
}

export function sortByName(a: Member, b: Member): number {
  return a.firstName.localeCompare(b.firstName);
}

export const memberStoreAdapter: EntityAdapter<Member> = createEntityAdapter<Member>({
  selectId: selectedMemberId,
  sortComparer: sortByName,
});

export const initialState: MemberState = memberStoreAdapter.getInitialState({
  selectedMemberId: null,
  isLoading: false,
  error: null
});

const memberStoreReducer = createReducer(
  initialState,

  on(MemberStoreActions.loadMemberStores, state => {
    return { ...state, isLoading: true, error: null };
  }),
  on(MemberStoreActions.loadMemberStoresSuccess, (state, action) => {
    return memberStoreAdapter.addAll(action.data, {
      ...state,
      isLoading: false,
      error: null
    });
  }),
  on(MemberStoreActions.loadMemberStoresFailure, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error
    };
  })
);

export function reducer(state: MemberState | undefined, action: Action) {
  return memberStoreReducer(state, action);
}
