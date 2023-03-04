import { Component } from '@angular/core';
import { MqttClient } from 'mqtt';
import { IMqttServiceOptions, MqttService} from 'ngx-mqtt';
import  * as mqtt from 'mqtt';
import { EdscorbotMqttServiceService } from './services/edscorbot-mqtt-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'edscorbot-angular';

  constructor(private mqttService:EdscorbotMqttServiceService){}
}
