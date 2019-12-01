import * as fromWorkshopStore from './workshop-store.reducer';
import { selectWorkshopStoreState } from './workshop-store.selectors';

describe('WorkshopStore Selectors', () => {
  it('should select the feature state', () => {
    const result = selectWorkshopStoreState({
      [fromWorkshopStore.workshopStoreFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
