import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { WorkshopStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("workshop", reducer),
    EffectsModule.forFeature([WorkshopStoreEffects])
  ],
  providers: [WorkshopStoreEffects]
})
export class WorkshopStoreModule {}
