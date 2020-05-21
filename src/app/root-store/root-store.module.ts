import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { MemberStoreModule } from "./member";
import { WorkshopStoreModule } from "./workshop";
import { CoffeeNCodeStoreModule } from "./coffee-n-code";
import { EventStoreModule } from "./event";
import { KodingKataStoreModule } from "./koding-kata";
import { LANStoreModule } from "./lan";
import { ProjectStoreModule } from "./project";
import { CTFStoreModule } from "./capture-the-flag";

@NgModule({
    imports: [
        CommonModule,
        MemberStoreModule,
        WorkshopStoreModule,
        CoffeeNCodeStoreModule,
        EventStoreModule,
        KodingKataStoreModule,
        LANStoreModule,
        ProjectStoreModule,
        CTFStoreModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
    ],
    declarations: [],
})
export class RootStoreModule {}
