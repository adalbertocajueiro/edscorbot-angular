import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent{
  loggedUser:string = "adalberto.cajueiro@gmail.com"
  configServ?:ConfigService
  
  constructor(private configService:ConfigService){
    this.configServ = configService
  }
  
}
