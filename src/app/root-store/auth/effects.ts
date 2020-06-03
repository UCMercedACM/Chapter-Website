import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, exhaustMap } from "rxjs/operators";

import * as AuthActions from "./actions";

@Injectable()
export class AuthStoreEffects {
  constructor(private actions: Actions) {}

  authUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.Authentication),
      map((data) => AuthActions.AuthenticationSuccess({ data })),
      catchError((error) => of(AuthActions.AuthenticationFailure({ error })))
    );
  });
}
