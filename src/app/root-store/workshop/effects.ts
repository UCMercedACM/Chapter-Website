import { Injectable } from "@angular/core";
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { WorkshopService } from "../../services";
import * as WorkshopActions from "./actions";

@Injectable()
export class WorkshopStoreEffects {
  constructor(
    private workshopService: WorkshopService,
    private actions: Actions
  ) {}

  loadWorkshopStores$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ROOT_EFFECTS_INIT),
      concatMap(() =>
        this.workshopService.getWorkshops().pipe(
          map((data) => WorkshopActions.loadWorkshopsSuccess({ data })),
          catchError((error) =>
            of(WorkshopActions.loadWorkshopsFailure({ error }))
          )
        )
      )
    );
  });
}
