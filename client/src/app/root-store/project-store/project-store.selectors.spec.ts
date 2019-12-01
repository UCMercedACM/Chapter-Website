import * as fromProjectStore from './project-store.reducer';
import { selectProjectStoreState } from './project-store.selectors';

describe('ProjectStore Selectors', () => {
  it('should select the feature state', () => {
    const result = selectProjectStoreState({
      [fromProjectStore.projectStoreFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
