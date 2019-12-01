import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { WorkshopStoreEffects } from './workshop-store.effects';

describe('WorkshopStoreEffects', () => {
  let actions$: Observable<any>;
  let effects: WorkshopStoreEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkshopStoreEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<WorkshopStoreEffects>(WorkshopStoreEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
