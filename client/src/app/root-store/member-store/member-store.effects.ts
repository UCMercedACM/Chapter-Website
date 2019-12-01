import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, concatMap } from "rxjs/operators";
import { EMPTY, of } from "rxjs";

import * as MemberStoreActions from "./member-store.actions";

@Injectable()
export class MemberStoreEffects {
  loadMemberStores$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MemberStoreActions.loadMemberStores),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => MemberStoreActions.loadMemberStoresSuccess({ data })),
          catchError(error =>
            of(MemberStoreActions.loadMemberStoresFailure({ error }))
          )
        )
      )
    );
  });

  constructor(private actions$: Actions) {}
}
