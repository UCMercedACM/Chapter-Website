import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ProjectStoreEffects } from './project-store.effects';

describe('ProjectStoreEffects', () => {
  let actions$: Observable<any>;
  let effects: ProjectStoreEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectStoreEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<ProjectStoreEffects>(ProjectStoreEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
