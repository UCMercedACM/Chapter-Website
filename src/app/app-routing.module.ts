import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventsComponent } from "./pages/events/events.component";
import { HomeComponent } from "./pages/home/home.component";
import { ResourcesComponent } from "./pages/resources/resources.component";
import { SigsComponent } from "./pages/sigs/sigs.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "events", component: EventsComponent },
  { path: "sigs", component: SigsComponent },
  { path: "resources", component: ResourcesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
