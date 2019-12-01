import { createAction, props } from '@ngrx/store';

export const loadProjectStores = createAction(
  '[ProjectStore] Load ProjectStores'
);

export const loadProjectStoresSuccess = createAction(
  '[ProjectStore] Load ProjectStores Success',
  props<{ data: any }>()
);

export const loadProjectStoresFailure = createAction(
  '[ProjectStore] Load ProjectStores Failure',
  props<{ error: any }>()
);
