import { Injectable } from "@angular/core";
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { EventService } from "../../services";
import * as EventActions from "./actions";

@Injectable()
export class EventStoreEffects {
  constructor(private eventService: EventService, private actions: Actions) {}

  loadMemberStores$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ROOT_EFFECTS_INIT),
      concatMap(() =>
        this.eventService.getEvents().pipe(
          map((data) => EventActions.loadEventsSuccess({ data })),
          catchError((error) => of(EventActions.loadEventsFailure({ error })))
        )
      )
    );
  });
}
