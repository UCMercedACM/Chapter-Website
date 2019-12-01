import { createAction, props } from '@ngrx/store';

export const loadWorkshopStores = createAction(
  '[WorkshopStore] Load WorkshopStores'
);

export const loadWorkshopStoresSuccess = createAction(
  '[WorkshopStore] Load WorkshopStores Success',
  props<{ data: any }>()
);

export const loadWorkshopStoresFailure = createAction(
  '[WorkshopStore] Load WorkshopStores Failure',
  props<{ error: any }>()
);
