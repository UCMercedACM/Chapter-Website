// Core Utility Imports
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from "./app-routing.module"; // Routing Import
import { AppComponent } from "./app.component"; // Main app import

// Component Imports
import { TitleComponent, CoffeeComponent, NavbarComponent } from "./components";

// Container Imports
import {
  CoffeeNCodeComponent,
  HomeComponent,
  ProjectsComponent,
  WorkshopsComponent,
  DashboardsComponent,
  LanComponent,
  CodeEditorComponent,
  InterviewsComponent,
  CalendarComponent
} from "./containers";

// NgRx Store Imports
import { RootStoreModule } from "./root-store";
import { MembersComponent } from './containers/members/members.component';
import { AccountComponent } from './containers/account/account.component';

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
    CalendarComponent,
    MembersComponent,
    AccountComponent
  ],
  imports: [
    NgbModule

    // Angular
    BrowserModule,

    // Application
    AppRoutingModule,

    // NgRx
    RootStoreModule,

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrument({
      name: "NgRx ACM App",
      maxAge: 25, // Retains last 25 states
    })
  ],
    HttpClientModule,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
