import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

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
import { LoginComponent } from './components/login/login.component';
import { DataService } from './services/data.service'

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
    LoginComponent
  ],
  imports: [HttpClientModule, BrowserModule, AppRoutingModule, RootStoreModule, FormsModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
