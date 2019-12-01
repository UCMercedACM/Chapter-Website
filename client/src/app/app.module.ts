import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './components/title/title.component';
import { CoffeeComponent } from './components/coffee/coffee.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CoffeeNCodeComponent } from './pages/coffee-n-code/coffee-n-code.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { WorkshopsComponent } from './pages/workshops/workshops.component';
import { DashboardsComponent } from './pages/dashboards/dashboards.component';
import { LanComponent } from './pages/lan/lan.component';
import { CodeEditorComponent } from './pages/code-editor/code-editor.component';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

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
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
