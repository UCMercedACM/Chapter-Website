import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, concatMap } from "rxjs/operators";
import { EMPTY, of } from "rxjs";

// import { DataService } from "../../services/data.service";
import * as MemberStoreActions from "./member-store.actions";

@Injectable()
export class MemberStoreEffects {
  // constructor(private dataService: DataService, private actions$: Actions) {}
  constructor(private actions$: Actions) {}

  loadMemberStores$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MemberStoreActions.loadMemberStores),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        // this.dataService.getItems().pipe(
        //   map(data => MemberStoreActions.loadMemberStoresSuccess({ data })),
        //   catchError(error =>
        //     of(MemberStoreActions.loadMemberStoresFailure({ error }))
        //   )
        // )
        EMPTY.pipe(
          map(data => MemberStoreActions.loadMemberStoresSuccess({ data })),
          catchError(error =>
            of(MemberStoreActions.loadMemberStoresFailure({ error }))
          )
        )
      )
    );
  });
}
