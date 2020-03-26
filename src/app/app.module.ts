// Core Utility Imports
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { Store } from "@ngrx/store";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppRoutingModule } from "./app-routing.module"; // Routing Import
import { AppComponent } from "./app.component"; // Main app import

// Component Imports
import {
  TitleComponent,
  CoffeeComponent,
  WorkshopCardComponent,
  ProjectsDisplayComponent,
  TerminalComponent
} from "./components";

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
  CalendarComponent,
  MembersComponent,
  AccountComponent,
  LoginComponent,
  SignUpComponent,
  EventsComponent
} from "./containers";

// NgRx Store Imports
import {
  RootStoreModule,
  RootStoreState,
  MemberStoreActions
} from "./root-store";

// Data Services
import { DataService } from "./services/data.service";

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    CoffeeComponent,
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
    LoginComponent,
    AccountComponent,
    WorkshopCardComponent,
    ProjectsDisplayComponent,
    LoginComponent,
    SignUpComponent,
    TerminalComponent,
    EventsComponent
  ],
  imports: [
    HttpClientModule,

    // Angular
    BrowserModule,

    // Application
    AppRoutingModule,

    // NgRx
    RootStoreModule,

    // Fontawesome
    FontAwesomeModule,

    ReactiveFormsModule,

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
      maxAge: 25 // Retains last 25 states
    })
  ],
  providers: [
    DataService,
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store<RootStoreState.State>) => {
        return () => {
          store.dispatch(MemberStoreActions.loadMembers());
        };
      },
      multi: true,
      deps: [Store]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
