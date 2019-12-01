import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as WorkshopStoreActions from './workshop-store.actions';



@Injectable()
export class WorkshopStoreEffects {

  loadWorkshopStores$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(WorkshopStoreActions.loadWorkshopStores),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => WorkshopStoreActions.loadWorkshopStoresSuccess({ data })),
          catchError(error => of(WorkshopStoreActions.loadWorkshopStoresFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
