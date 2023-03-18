import { Component, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
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

  selectedRobot?:MetaInfoObject
  availableRobots:MetaInfoObject[] = []
  connected:boolean = false

  @ViewChild("selectRobot") select?:  MatSelect
  
  constructor(private mqttService:EdscorbotMqttServiceService,
              private dialog:MatDialog){

  }
  ngOnInit(): void {
    this.mqttService.sendRequestMetaInfo()
    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          if(commandObj.signal == ARM_STATUS){
              this.selectedRobot = this.mqttService.selectedRobot
              this.availableRobots = this.mqttService.availableRobots
          }
          if(commandObj.signal == ARM_CONNECTED){
              this.connected = this.mqttService.loggedUser.id == this.mqttService.owner?.id
              this.selectedRobot = this.mqttService.selectedRobot
              this.availableRobots = this.mqttService.availableRobots
          }
          if(commandObj.signal == ARM_DISCONNECTED){
            this.selectedRobot = this.mqttService.selectedRobot
            if(this.mqttService.loggedUser.id == commandObj.client.id){
              this.connected = false
              // this.select?.options.forEach((item: MatOption) => item.deselect());
            } 
            //this.mqttService.sendRequestMetaInfo()
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )
    this.mqttService.metaInfoSubject.subscribe(
      {
        next: (res) => {
          this.availableRobots = this.mqttService.availableRobots
        },
        error: (err) => { console.log('error',err)}
      }
    )
  }

  
  processConnection(){
    if (this.connected){
      this.mqttService.sendDisconnectMessage()
    } else {
      this.mqttService.sendConnectMessage()
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
