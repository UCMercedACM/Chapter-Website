import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { LANStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature("lan", reducer),
        EffectsModule.forFeature([LANStoreEffects]),
    ],
    providers: [LANStoreEffects],
})
export class LANStoreModule {}
