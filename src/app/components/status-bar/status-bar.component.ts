import { Component} from '@angular/core';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent {

  mqttServ?:EdscorbotMqttServiceService
  
  constructor(private mqttService:EdscorbotMqttServiceService){
    this.mqttServ = mqttService
  }

  processConnection(){
    if (this.mqttService.connected == 'YES'){
      this.disconnect()
    } else {
      if(this.mqttService.serverStatus && this.mqttService.serverStatus == 'FREE'){
        this.connect()
      }
    }
  }

  connect() {
    this.mqttService.sendConnectMessage()
  }

  disconnect() {
    this.mqttService.sendDisconnectMessage()
  }
}
