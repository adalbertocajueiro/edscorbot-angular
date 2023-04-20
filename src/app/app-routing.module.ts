import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MovementsComponent } from './pages/movements/movements.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './util/auth.guard';
import { ToolsComponent } from './pages/tools/tools.component';
import { MessageComponent } from './pages/message/message.component';

const routes: Routes = [
  {path: '', redirectTo: 'movements', pathMatch: 'full'},
  {path: 'users', component:  UsersComponent , canActivate:[AuthGuard]},
  {path: 'movements', component: MovementsComponent, canActivate:[AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate:[AuthGuard]},
  {path: 'tools', component: ToolsComponent, canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  { path: 'message', component:  MessageComponent },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
