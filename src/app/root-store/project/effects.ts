import { Injectable } from "@angular/core";
import {
    Actions,
    createEffect,
    ofType,
    ROOT_EFFECTS_INIT,
} from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, concatMap } from "rxjs/operators";

import { ProjectService } from "../../services";
import * as ProjectActions from "./actions";

@Injectable()
export class ProjectStoreEffects {
    constructor(
        private projectService: ProjectService,
        private actions: Actions
    ) {}

    loadProjectStores$ = createEffect(() => {
        return this.actions.pipe(
            ofType(ROOT_EFFECTS_INIT),
            concatMap(() =>
                this.projectService.getProjects().pipe(
                    map((data) => ProjectActions.loadProjectsSuccess({ data })),
                    catchError((error) =>
                        of(ProjectActions.loadProjectsFailure({ error }))
                    )
                )
            )
        );
    });
}
