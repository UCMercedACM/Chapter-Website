import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import {
    HomeComponent,
    CoffeeNCodeComponent,
    ProjectsComponent,
    WorkshopsComponent,
    MembersComponent,
    NotFoundComponent,
    LoginComponent,
    SignUpComponent,
    EventsComponent,
    DashboardComponent,
    CTFComponent,
    LanComponent,
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
        path: "coffee-n-code",
        component: CoffeeNCodeComponent,
    },
    {
        path: "projects",
        component: ProjectsComponent,
    },
    {
        path: "workshops",
        component: WorkshopsComponent,
    },
    {
        path: "members",
        component: MembersComponent,
    },
    {
        path: "capture-the-flag",
        component: CTFComponent,
    },
    {
        path: "lan",
        component: LanComponent,
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "sign-up",
        component: SignUpComponent,
    },
    {
        path: "dashboard/:id",
        component: DashboardComponent,
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
