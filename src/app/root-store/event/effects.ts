import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap, exhaustMap } from "rxjs/operators";

import { EventService } from "../../services";
import * as EventActions from "./actions";

@Injectable()
export class EventStoreEffects {
  constructor(private eventService: EventService, private actions: Actions) {}

  loadMemberStores$ = createEffect(() => {
    return this.actions.pipe(
      ofType(EventActions.loadEvents),
      concatMap(() =>
        this.eventService.getEvents().pipe(
          map(data => EventActions.loadEventsSuccess({ data })),
          catchError(error => of(EventActions.loadEventsFailure({ error })))
        )
      )
    );
  });
}
