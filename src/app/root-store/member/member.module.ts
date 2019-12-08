import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { MemberStoreEffects } from "./effects";
import { reducer } from "./reducer";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("member", memberReducer),
    EffectsModule.forFeature([MemberStoreEffects])
  ],
  providers: [MemberStoreEffects]
})
export class MemberStoreModule {}
