import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import * as fromWorkshopStore from "./workshop-store/workshop-store.reducer";
import { WorkshopStoreEffects } from "./workshop-store/workshop-store.effects";
import * as fromProjectStore from "./project-store/project-store.reducer";
import { ProjectStoreEffects } from "./project-store/project-store.effects";
import * as fromMemberStore from "./member-store/member-store.reducer";
import { MemberStoreEffects } from "./member-store/member-store.effects";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      WorkshopStoreEffects,
      ProjectStoreEffects,
      MemberStoreEffects
    ]),
    StoreModule.forFeature(
      fromWorkshopStore.workshopStoreFeatureKey,
      fromWorkshopStore.reducer
    ),
    StoreModule.forFeature(
      fromProjectStore.projectStoreFeatureKey,
      fromProjectStore.reducer
    ),
    StoreModule.forFeature(
      fromMemberStore.memberStoreFeatureKey,
      fromMemberStore.reducer
    )
  ]
})
export class RootStoreModule {}
