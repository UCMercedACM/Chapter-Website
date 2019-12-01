import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWorkshopStore from './workshop-store.reducer';

export const selectWorkshopStoreState = createFeatureSelector<fromWorkshopStore.State>(
  fromWorkshopStore.workshopStoreFeatureKey
);
