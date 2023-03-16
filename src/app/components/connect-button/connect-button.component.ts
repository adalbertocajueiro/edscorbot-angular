import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { FREE, BUSY, ERROR, ARM_STATUS, ARM_CONNECTED, ARM_DISCONNECTED } from 'src/app/util/constants';

@Component({
  selector: 'app-connect-button',
  templateUrl: './connect-button.component.html',
  styleUrls: ['./connect-button.component.scss']
})
export class ConnectButtonComponent implements OnInit{

  @Output()
  click:EventEmitter<any> = new EventEmitter<any>()

  status?:number
  className:string = 'disconnected'
  iconName:string = ''
  tooltip:string = ''
  buttonLabel:string = 'Robot not selected'
  enableButtonConnect:boolean = false

  constructor(private mqttService:EdscorbotMqttServiceService){
    this.status = this.mqttService.serverStatus

    

  }
  ngOnInit(): void {
    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          
          if(commandObj.signal == ARM_STATUS
              || commandObj.signal == ARM_CONNECTED
              || commandObj.signal == ARM_DISCONNECTED){
            
              this.status = this.mqttService.serverStatus
              this.iconName = this.getIconName(this.status)
              this.className = this.getClassName(this.status)
              this.tooltip = this.getTooltip(this.status, commandObj.client)
              this.buttonLabel = this.mqttService.buttonLabel
              this.enableButtonConnect = this.mqttService.enableButtonConnect
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )
    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          console.log('selected robot', res)
          this.className = 'disconnected'
          this.buttonLabel = 'Robot not selected'
          this.enableButtonConnect = this.mqttService.enableButtonConnect
        }
      }
    )
  }

  getIconName(status?:number){
    if(status != undefined){
      switch(status){
        case FREE:
          return 'link'
        case BUSY:
          if(this.mqttService.connected){
            return 'link_off'
          } else {
            return 'sentiment_dissatisfied'
          }
          
        case ERROR:
          return 'error'
        default:
          return ''
      }
    } else {
      return ''
    }
  }

  getClassName(status?:number){
    if(status != undefined){
      switch(status){
        case FREE:
          return 'free'
        case BUSY:
          return 'busy'
        case ERROR:
          return 'error'
        default:
          return ''
      }
    } else {
      return ''
    }
  }

  getTooltip(status?:number, client?:any){
    if(status != undefined){
      switch(status){
        case FREE:
          return 'Connect to the arm'
        case BUSY:
          if(client?.id == this.mqttService.loggedUser.id){
            return 'You are connected'
          } else {
            return 'Arm is busy'
          }   
        case ERROR:
          return 'Internal error in the arm'
        default:
          return ''
      }
    } else {
      return ''
    }
  }
}
