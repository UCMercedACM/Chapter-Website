import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as ProjectStoreActions from './project-store.actions';



@Injectable()
export class ProjectStoreEffects {

  loadProjectStores$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(ProjectStoreActions.loadProjectStores),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => ProjectStoreActions.loadProjectStoresSuccess({ data })),
          catchError(error => of(ProjectStoreActions.loadProjectStoresFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
