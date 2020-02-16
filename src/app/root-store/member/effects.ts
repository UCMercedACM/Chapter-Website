import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { DataService } from "../../services/data.service";
import * as MemberActions from "./actions";

@Injectable()
export class MemberStoreEffects {
  constructor(private dataService: DataService, private actions: Actions) {}

  loadMemberStores$ = createEffect(() => {
    return this.actions.pipe(
      ofType(MemberActions.loadMembers),
      concatMap(() =>
        this.dataService.getMembers().pipe(
          map(data => MemberActions.loadMembersSuccess({ data })),
          catchError(error => of(MemberActions.loadMembersFailure({ error })))
        )
      )
    );
  });
}