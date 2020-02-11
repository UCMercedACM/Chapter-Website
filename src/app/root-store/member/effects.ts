import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap, exhaustMap } from "rxjs/operators";

import { DataService } from "../../services/data.service";
import * as memberActions from "./actions";

@Injectable()
export class MemberStoreEffects {
  constructor(private dataService: DataService, private actions: Actions) {}

  loadMemberStores$ = createEffect(() => {
    return this.actions.pipe(
      ofType(memberActions.loadMembers),
      concatMap(() =>
        this.dataService.getItems().pipe(
          map(data => memberActions.loadMembersSuccess({ data })),
          catchError(error => of(memberActions.loadMembersFailure({ error })))
        )
      )
    );
  });

  authUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(memberActions.loadAuth),
      exhaustMap(action =>
        this.dataService.login(action.email, action.password).pipe(
          map(data => memberActions.loadAuthSuccess({ data })),
          catchError(error => of(memberActions.loadAuthFailure({ error })))
        )
      )
    );
  });
}
