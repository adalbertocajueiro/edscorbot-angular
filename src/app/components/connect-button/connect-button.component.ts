import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { FREE, BUSY, ERROR } from 'src/app/util/constants';

@Component({
  selector: 'app-connect-button',
  templateUrl: './connect-button.component.html',
  styleUrls: ['./connect-button.component.scss']
})
export class ConnectButtonComponent implements OnInit {

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
          this.updateFields()
        },
        error: (err) => { console.log('error',err)}
      }
    )
    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          console.log('selected robot', res)
          this.updateFields()
        }
      }
    )
  }

  updateFields(){
    this.status = this.getStatus()
    this.iconName = this.getIconName()
    this.className = this.getClassName()
    this.tooltip = this.getTooltip()
    this.buttonLabel = this.getButtonLabel()
    this.enableButtonConnect = this.getEnableButtonConnect()
    
  }

  getStatus(){
    if (this.mqttService.serverError){
      return ERROR
    } else if (this.mqttService.owner == undefined){
      return FREE
    } else if (this.mqttService.owner != undefined){
      return BUSY
    }
    return undefined
  }
  getIconName(){
    
    if(this.status != undefined){
      switch(this.status){
        case FREE:
          return 'link'
        case BUSY:
          //if logged user is equals to the owner then disconnect
          if(this.mqttService.owner?.id == this.mqttService.loggedUser.id){
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

  getClassName(){
    if(this.status != undefined){
      switch(this.status){
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
      return 'disabled'
    }
  }

  getTooltip(){
    if(this.status != undefined){
      switch(this.status){
        case FREE:
          return 'Connect to the arm'
        case BUSY:
          if(this.mqttService.owner?.id == this.mqttService.loggedUser.id){
            return 'Disconnect from the arm'
          } else {
            return 'Arm is busy'
          }   
        case ERROR:
          return 'Internal error in the arm'
        default:
          return ''
      }
    } else {
      return 'Choose one arm'
    }
  }

  getButtonLabel(){
    if(this.status != undefined){
      switch(this.status){
        case FREE:
          return 'Connect'
        case BUSY:
          if(this.mqttService.owner?.id == this.mqttService.loggedUser.id){
            return 'Disconnect'
          } else {
            return 'Wait'
          }   
        case ERROR:
          return 'Wait'
        default:
          return ''
      }
    } else {
      return 'Robot not selected'
    }
  }

  getEnableButtonConnect(){
    if(this.status != undefined){
      switch(this.status){
        case FREE:
          return true
        case BUSY:
          if(this.mqttService.owner?.id == this.mqttService.loggedUser.id){
            return true
          } else {
            return false
          } 
        case ERROR:
          return false
        default:
          return false
      }
    } else {
      return false
    }
  }
}
