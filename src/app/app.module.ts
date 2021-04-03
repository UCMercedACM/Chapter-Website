import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { EventsComponent } from "./pages/events/events.component";
import { SigsComponent } from "./pages/sigs/sigs.component";
import { ResourcesComponent } from "./pages/resources/resources.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { SectionTitleComponent } from "./components/section-title/section-title.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventsComponent,
    SigsComponent,
    ResourcesComponent,
    SectionTitleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
