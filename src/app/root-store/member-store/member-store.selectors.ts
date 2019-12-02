import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromMemberStore from "./member-store.reducer";

export const selectMemberStoreState = createFeatureSelector<
  fromMemberStore.State
>(fromMemberStore.memberStoreFeatureKey);
