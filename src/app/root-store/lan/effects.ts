import { Injectable } from "@angular/core";
import {
    Actions,
    createEffect,
    ofType,
    ROOT_EFFECTS_INIT,
} from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { LANService } from "../../services";
import * as LANActions from "./actions";

@Injectable()
export class LANStoreEffects {
    constructor(private lanService: LANService, private actions: Actions) {}

    loadLANStores$ = createEffect(() => {
        return this.actions.pipe(
            ofType(ROOT_EFFECTS_INIT),
            concatMap(() =>
                this.lanService.getLANParties().pipe(
                    map((data) => LANActions.loadLANPartySuccess({ data })),
                    catchError((error) =>
                        of(LANActions.loadLANPartyFailure({ error }))
                    )
                )
            )
        );
    });
}
