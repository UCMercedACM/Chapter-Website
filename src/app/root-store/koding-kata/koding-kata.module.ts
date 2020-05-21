import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { KodingKataStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("koding-kata", reducer),
    EffectsModule.forFeature([KodingKataStoreEffects]),
  ],
  providers: [KodingKataStoreEffects],
})
export class KodingKataStoreModule {}
