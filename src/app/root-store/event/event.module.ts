import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { EventStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature("event", reducer),
        EffectsModule.forFeature([EventStoreEffects]),
    ],
    providers: [EventStoreEffects],
})
export class EventStoreModule {}
