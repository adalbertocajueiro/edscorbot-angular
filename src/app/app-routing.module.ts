import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MovementsComponent } from './pages/movements/movements.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {path: '', redirectTo: 'movements', pathMatch: 'full'},
  {path: 'users', component:  UsersComponent},
  {path: 'movements', component: MovementsComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
