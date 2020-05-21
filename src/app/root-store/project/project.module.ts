import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { ProjectStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature("project", reducer),
        EffectsModule.forFeature([ProjectStoreEffects]),
    ],
    providers: [ProjectStoreEffects],
})
export class ProjectStoreModule {}
