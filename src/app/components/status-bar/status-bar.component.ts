import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { ARM_CHECK_STATUS, ARM_CONNECT, ARM_DISCONNECT, COMMANDS_CHANNEL } from 'src/app/util/constants';

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
