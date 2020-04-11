import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap, exhaustMap } from "rxjs/operators";

import { MemberService } from "../../services";
import * as MemberActions from "./actions";

@Injectable()
export class MemberStoreEffects {
  constructor(private workshopService: MemberService, private actions: Actions) {}

  // loadMemberStores$ = createEffect(() => {
  //   return this.actions.pipe(
  //     ofType(MemberActions.loadMembers),
  //     concatMap(() =>
  //       this.workshopService.getMembers().pipe(
  //         map(data => MemberActions.loadMembersSuccess({ data })),
  //         catchError(error => of(MemberActions.loadMembersFailure({ error })))
  //       )
  //     )
  //   );
  // });

  authUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(MemberActions.loginAuthentication),
      exhaustMap(action =>
        this.workshopService.login(action.email, action.password).pipe(
          map(data => MemberActions.loginAuthenticationSuccess({ data })),
          catchError(error =>
            of(MemberActions.loginAuthenticationFailure({ error }))
          )
        )
      )
    );
  });
}
