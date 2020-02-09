import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent, CoffeeNCodeComponent, ProjectsComponent, WorkshopsComponent, InterviewsComponent, MembersComponent, AccountComponent, CalendarComponent } from "./containers";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "calendar",
    component: CalendarComponent
  },
  {
    path: "coffee-n-code",
    component: CoffeeNCodeComponent
  },
  {
    path: "projects",
    component: ProjectsComponent
  },
  {
    path: "workshops",
    component: WorkshopsComponent
  },
  {
    path: "interview",
    component: InterviewsComponent
  },
  {
    path: "members",
    component: MembersComponent
  },
  {
    path: "account",
    component: AccountComponent
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
``