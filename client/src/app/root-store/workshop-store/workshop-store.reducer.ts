import { Action, createReducer, on } from '@ngrx/store';
import * as WorkshopStoreActions from './workshop-store.actions';

export const workshopStoreFeatureKey = 'workshopStore';

export interface State {

}

export const initialState: State = {

};

const workshopStoreReducer = createReducer(
  initialState,

  on(WorkshopStoreActions.loadWorkshopStores, state => state),
  on(WorkshopStoreActions.loadWorkshopStoresSuccess, (state, action) => state),
  on(WorkshopStoreActions.loadWorkshopStoresFailure, (state, action) => state),

);

export function reducer(state: State | undefined, action: Action) {
  return workshopStoreReducer(state, action);
}
