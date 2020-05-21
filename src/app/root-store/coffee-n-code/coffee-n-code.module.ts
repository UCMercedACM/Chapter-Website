import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { CoffeeNCodeStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature("coffee-n-code", reducer),
        EffectsModule.forFeature([CoffeeNCodeStoreEffects]),
    ],
    providers: [CoffeeNCodeStoreEffects],
})
export class CoffeeNCodeStoreModule {}
