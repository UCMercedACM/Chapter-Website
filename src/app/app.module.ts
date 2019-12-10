import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TitleComponent } from "./components/title/title.component";
import { CoffeeComponent } from "./components/coffee/coffee.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CoffeeNCodeComponent } from "./containers/coffee-n-code/coffee-n-code.component";
import { HomeComponent } from "./containers/home/home.component";
import { ProjectsComponent } from "./containers/projects/projects.component";
import { WorkshopsComponent } from "./containers/workshops/workshops.component";
import { DashboardsComponent } from "./containers/dashboards/dashboards.component";
import { LanComponent } from "./containers/lan/lan.component";
import { CodeEditorComponent } from "./containers/code-editor/code-editor.component";
import { InterviewsComponent } from "./containers/interviews/interviews.component";
import { CalendarComponent } from "./containers/calendar/calendar.component";
import { RootStoreModule } from "./root-store";
import { environment } from "../environments/environment"; // Angular CLI environment

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    CoffeeComponent,
    NavbarComponent,
    CoffeeNCodeComponent,
    HomeComponent,
    ProjectsComponent,
    WorkshopsComponent,
    DashboardsComponent,
    LanComponent,
    CodeEditorComponent,
    InterviewsComponent,
    CalendarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RootStoreModule,
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
