import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProjectStore from './project-store.reducer';

export const selectProjectStoreState = createFeatureSelector<fromProjectStore.State>(
  fromProjectStore.projectStoreFeatureKey
);
