import { Component } from '@angular/core';
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
