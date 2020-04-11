import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap, exhaustMap } from "rxjs/operators";

import { WorkshopService } from "../../services";
import * as WorkshopActions from "./actions";

@Injectable()
export class WorkshopStoreEffects {
  constructor(private workshopService: WorkshopService, private actions: Actions) {}

  loadWorkshopStores$ = createEffect(() => {
    return this.actions.pipe(
      ofType(WorkshopActions.loadWorkshops),
      concatMap(() =>
        this.workshopService.getWorkshops().pipe(
          map(data => WorkshopActions.loadWorkshopsSuccess({ data })),
          catchError(error => of(WorkshopActions.loadWorkshopsFailure({ error })))
        )
      )
    );
  });
}
