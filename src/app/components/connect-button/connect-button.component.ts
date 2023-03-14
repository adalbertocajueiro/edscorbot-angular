import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { FREE, BUSY, ERROR, ARM_STATUS, ARM_CONNECTED, ARM_DISCONNECTED } from 'src/app/util/constants';

@Component({
  selector: 'app-connect-button',
  templateUrl: './connect-button.component.html',
  styleUrls: ['./connect-button.component.scss']
})
export class ConnectButtonComponent implements OnDestroy{

  @Output()
  click:EventEmitter<any> = new EventEmitter<any>()

  status?:number
  className:string = 'disconnected'
  iconName:string = ''
  buttonLabel:string = 'Robot not selected'
  enableButtonConnect:boolean = false

  constructor(private mqttService:EdscorbotMqttServiceService){
    this.status = this.mqttService.serverStatus

    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          
          if(commandObj.signal == ARM_STATUS
              || commandObj.signal == ARM_CONNECTED
              || commandObj.signal == ARM_DISCONNECTED){
            
              this.status = this.mqttService.serverStatus
              this.iconName = this.getIconName(this.status)
              this.className = this.getClassName(this.status)
              this.buttonLabel = this.mqttService.buttonLabel
              this.enableButtonConnect = this.mqttService.enableButtonConnect
          }
        },
        error: (err) => { console.log('error',err)}
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
            return ''
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
  ngOnDestroy(): void {
    this.mqttService.commandsSubject.unsubscribe()
  }


}
