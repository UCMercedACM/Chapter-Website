import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { DataService } from "../../services/data.service";
import * as memberActions from "./actions";

@Injectable()
export class MemberStoreEffects {
  constructor(private dataService: DataService, private actions$: Actions) {}

  @Effect()
  loadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<memberActions.LoadRequestAction>(
      memberActions.ActionTypes.LOAD_REQUEST
    ),
    startWith(new memberActions.LoadRequestAction()),
    switchMap(action =>
      this.dataService.getItems().pipe(
        map(
          items =>
            new memberActions.LoadSuccessAction({
              items
            })
        ),
        catchError(error =>
          observableOf(new memberActions.LoadFailureAction({ error }))
        )
      )
    )
  );
}
