import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SidenavItemComponent } from './components/sidenav/sidenav-item/sidenav-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule} from '@angular/material/tabs';
import { MatIconModule} from '@angular/material/icon';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule} from '@angular/material/select';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TrajectoriesComponent } from './pages/movements/trajectories/trajectories.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { TrajectoryTableComponent } from './components/trajectory-table/trajectory-table.component';
import { TableLineComponent } from './components/trajectory-table/table-line/table-line.component';
import { MqttModule } from 'ngx-mqtt';
import { MovementsComponent } from './pages/movements/movements.component';
import { SingleComponent } from './pages/movements/single/single.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { ToogleButtonComponent } from './components/toogle-button/toogle-button.component';
import { PlotlyComponent } from './components/plotly/plotly.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoginComponent } from './pages/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginDialogComponent } from './pages/login/login-dialog/login-dialog.component';
import { AuthInterceptor } from './util/auth.interceptor';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { ErrorInterceptor } from './util/error.interceptor';

export const MQTT_SERVICE_OPTIONS = {
  hostname: 'localhost',
   port: 8080,
   //path: '/mqtt',
   clean: true, // Retain session
   connectTimeout: 4000, // Timeout period
   reconnectPeriod: 4000, // Reconnect period
   // Authentication information
   clientId: 'mqttx_597046f4',
   //protocol: 'ws',
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    SidenavItemComponent,
    UsersComponent,
    SettingsComponent,
    TrajectoriesComponent,
    NotFoundComponent,
    StatusBarComponent,
    TrajectoryTableComponent,
    TableLineComponent,
    MovementsComponent,
    SingleComponent,
    DialogComponent,
    InfoDialogComponent,
    ToogleButtonComponent,
    PlotlyComponent,
    SpinnerComponent,
    LoginComponent,
    LoginDialogComponent,
    ToggleSwitchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [
    {
       provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptor,
       multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  
 }
