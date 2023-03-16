import { Component, ViewChild} from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { ARM_CONNECTED, ARM_DISCONNECTED, ARM_GET_METAINFO, ARM_METAINFO, ARM_STATUS, FREE, META_INFO_CHANNEL } from 'src/app/util/constants';
import { MetaInfoObject } from 'src/app/util/matainfo';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent {

  status?:number
  selectedRobot?:MetaInfoObject
  availableRobots:MetaInfoObject[] = []
  connected:boolean = false

  @ViewChild("selectRobot") select?:  MatSelect
  
  constructor(private mqttService:EdscorbotMqttServiceService,
              private dialog:MatDialog){

  }
  ngOnInit(): void {
    
    this.getRobotInfo()
    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          
          if(commandObj.signal == ARM_STATUS
              || commandObj.signal == ARM_CONNECTED){
            
              this.status = this.mqttService.serverStatus
              this.selectedRobot = this.mqttService.selectedRobot
              this.availableRobots = this.mqttService.availableRobots
              this.connected = this.mqttService.connected
          }
          if(commandObj.signal == ARM_DISCONNECTED){
            
            this.selectedRobot = this.mqttService.selectedRobot
            this.select?.options.forEach((item: MatOption) => item.deselect());
            this.connected = this.mqttService.connected
            this.getRobotInfo()
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )
    this.mqttService.metaInfoSubject.subscribe(
      {
        next: (commandObj) => {
          
          if(commandObj.signal == ARM_METAINFO){
              this.status = this.mqttService.serverStatus
              this.selectedRobot = this.mqttService.selectedRobot
              this.availableRobots = this.mqttService.availableRobots
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )
  }

  getRobotInfo(){
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
  processConnection(){
    if (this.mqttService.connected){
      this.mqttService.sendDisconnectMessage()
    } else {
      if(this.mqttService.serverStatus == FREE){
        this.mqttService.sendConnectMessage()
      }
    }
  }

  robotSelected(event:any){
    
    this.mqttService.selectRobotByName(event.value)
  }

  openInfoDialog() {
    this.dialog.open(InfoDialogComponent, 
      {
        data: {
          selectedRobot:this.selectedRobot
        },
      })
  }
}
