import { Injectable } from "@angular/core";
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { KodingKataService } from "../../services";
import * as KodingKataActions from "./actions";

@Injectable()
export class KodingKataStoreEffects {
  constructor(
    private kodingKataService: KodingKataService,
    private actions: Actions
  ) {}

  loadTechnicalInterviewQuestionsStores$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ROOT_EFFECTS_INIT),
      concatMap(() =>
        this.kodingKataService.getTechnicalInterviewQuestions().pipe(
          map((data) => KodingKataActions.loadTechnicalInterviewQuestionsSuccess({ data })),
          catchError((error) =>
            of(KodingKataActions.loadTechnicalInterviewQuestionsFailure({ error }))
          )
        )
      )
    );
  });
}
