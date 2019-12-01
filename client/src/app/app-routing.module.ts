import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CoffeeNCodeComponent } from './pages/coffee-n-code/coffee-n-code.component';

const routes: Routes = [
  {
    path: 'home',
    component: AppComponent
  },
  {
    path: 'coffee-n-code',
    component: CoffeeNCodeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
