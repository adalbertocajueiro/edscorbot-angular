import { Component, OnInit } from '@angular/core';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { ARM_GET_METAINFO, META_INFO_CHANNEL } from 'src/app/util/constants';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit{
  
  mqttServ?:EdscorbotMqttServiceService
  enrivonment = environment
  
  constructor(private mqttService:EdscorbotMqttServiceService){
    this.mqttServ = mqttService
  }
  ngOnInit(): void {
    this.requestList()
  }

  toggleSelect(robot:any,selected:boolean){
    if(selected){
      this.mqttService.selectRobot(robot)
    }
  }

  requestList(){
    if(this.mqttService.selectedRobot == undefined){
      const content = {
        signal: ARM_GET_METAINFO
      }
      const publish = {
        topic: META_INFO_CHANNEL,
        qos: 0,
        payload: JSON.stringify(content)
      }
      this.mqttService.client.unsafePublish(publish.topic,publish.payload,publish.qos)
    } 
  }
  refresh(){
    this.requestList()
  }
  
}
