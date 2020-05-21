import { Injectable } from "@angular/core";
import {
    Actions,
    createEffect,
    ofType,
    ROOT_EFFECTS_INIT,
} from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { CoffeeNCodeService } from "../../services";
import * as CoffeeNCodeActions from "./actions";

@Injectable()
export class CoffeeNCodeStoreEffects {
    constructor(
        private coffeeNCodeService: CoffeeNCodeService,
        private actions: Actions
    ) {}

    loadCoffeeNCodeStores$ = createEffect(() => {
        return this.actions.pipe(
            ofType(ROOT_EFFECTS_INIT),
            concatMap(() =>
                this.coffeeNCodeService.getResources().pipe(
                    map((data) =>
                        CoffeeNCodeActions.loadResourcesSuccess({ data })
                    ),
                    catchError((error) =>
                        of(CoffeeNCodeActions.loadResourcesFailure({ error }))
                    )
                )
            )
        );
    });
}
