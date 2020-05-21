import { Injectable } from "@angular/core";
import {
    Actions,
    createEffect,
    ofType,
    ROOT_EFFECTS_INIT,
} from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { CTFService } from "../../services";
import * as CTFActions from "./actions";

@Injectable()
export class CTFStoreEffects {
    constructor(private ctfService: CTFService, private actions: Actions) {}

    loadCTFMeetingStores$ = createEffect(() => {
        return this.actions.pipe(
            ofType(ROOT_EFFECTS_INIT),
            concatMap(() =>
                this.ctfService.getCTFMeetings().pipe(
                    map((data) => CTFActions.loadCTFMeetingsSuccess({ data })),
                    catchError((error) =>
                        of(CTFActions.loadCTFMeetingsFailure({ error }))
                    )
                )
            )
        );
    });
}
