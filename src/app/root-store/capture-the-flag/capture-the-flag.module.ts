import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { CTFStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature("ctf", reducer),
        EffectsModule.forFeature([CTFStoreEffects]),
    ],
    providers: [CTFStoreEffects],
})
export class CTFStoreModule {}
