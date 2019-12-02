import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { MyFeatureStoreEffects } from "./effects";
import { featureReducer } from "./reducer";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("myFeature", featureReducer),
    EffectsModule.forFeature([MyFeatureStoreEffects])
  ],
  providers: [MyFeatureStoreEffects]
})
export class MyFeatureStoreModule {}
