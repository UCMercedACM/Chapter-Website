import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { AuthStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature("auth", reducer),
        EffectsModule.forFeature([AuthStoreEffects]),
    ],
    providers: [AuthStoreEffects],
})
export class AuthStoreModule {}
