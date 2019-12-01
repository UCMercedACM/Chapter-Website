import { Action, createReducer, on } from '@ngrx/store';
import * as ProjectStoreActions from './project-store.actions';

export const projectStoreFeatureKey = 'projectStore';

export interface State {

}

export const initialState: State = {

};

const projectStoreReducer = createReducer(
  initialState,

  on(ProjectStoreActions.loadProjectStores, state => state),
  on(ProjectStoreActions.loadProjectStoresSuccess, (state, action) => state),
  on(ProjectStoreActions.loadProjectStoresFailure, (state, action) => state),

);

export function reducer(state: State | undefined, action: Action) {
  return projectStoreReducer(state, action);
}
