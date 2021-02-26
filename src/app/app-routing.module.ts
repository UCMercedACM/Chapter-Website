import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import {
    HomeComponent,
    NotFoundComponent,
    EventsComponent,
} from "./containers";

const routes: Routes = [
    {
        path: "home",
        component: HomeComponent,
    },
    {
        path: "events",
        component: EventsComponent,
    },
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full",
    },
    {
        path: "**",
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
