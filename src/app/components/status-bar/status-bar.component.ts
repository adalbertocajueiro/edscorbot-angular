import { Component, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { ARM_CONNECTED, ARM_DISCONNECTED, ARM_HOME_SEARCHED, BUSY, ERROR, FREE, ARM_STATUS } from 'src/app/util/constants';
import { MetaInfoObject } from 'src/app/util/matainfo';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent {

  selectedRobot?:MetaInfoObject
  availableRobots:MetaInfoObject[] = []
  connected:boolean = false

  loggedUser:any
  status?:number
  searchingHome:boolean = false
  
  tooltip:string = ''

  @ViewChild("selectRobot") select?:  MatSelect
  
  constructor(private mqttService:EdscorbotMqttServiceService,
              private dialog:MatDialog,
              private localStorageService:LocalStorageService,
              private router:Router){
      
  }
  ngOnInit(): void {
    this.loggedUser = this.localStorageService.getLoggedUser()
    this.updateFields()
    this.mqttService.sendRequestMetaInfo()
    this.mqttService.sendRequestStatusMessage()
    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          //console.log('command', commandObj)
          if(commandObj.signal == ARM_STATUS){
              //console.log('status received', commandObj, this)
              this.selectedRobot = this.mqttService.selectedRobot
              this.availableRobots = this.mqttService.availableRobots
              if(this.mqttService.owner){
                this.connected = this.mqttService.loggedUser?.id == this.mqttService.owner?.id
              } 
          }
          if(commandObj.signal == ARM_CONNECTED){
              this.connected = this.mqttService.loggedUser?.id == this.mqttService.owner?.id
              this.selectedRobot = this.mqttService.selectedRobot
              this.availableRobots = this.mqttService.availableRobots
          }
          if(commandObj.signal == ARM_DISCONNECTED){
            this.selectedRobot = this.mqttService.selectedRobot
            
            if(this.mqttService.loggedUser?.id == commandObj.client.id){
              this.connected = this.mqttService.loggedUser?.id == this.mqttService.owner?.id
              // this.select?.options.forEach((item: MatOption) => item.deselect());
            } else {
              this.connected = false
            }
            //this.mqttService.sendRequestMetaInfo()
          }
          if(commandObj.signal == ARM_HOME_SEARCHED){
            this.searchingHome = false
            this.connected = this.mqttService.loggedUser?.id == this.mqttService.owner?.id
          }
          this.updateFields()
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
    
    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          this.updateFields()
        }
      }
    )
    this.localStorageService.userChanged.subscribe({
      next: (res:any) => {
        //console.log('user changed',res)
        if(res == undefined){
          this.loggedUser = undefined
        } else {
          this.loggedUser = this.localStorageService.getLoggedUser()
        }
      },
      error: (err:any) => {console.log('error', err)}
    })
  }

  updateFields(){
    this.selectedRobot = this.mqttService.selectedRobot
    this.status = this.getStatus()
    this.changeToogleButtonColor()
    //this.enableClassName = this.getEnableClass()
    //this.className = this.getClassName()
    this.tooltip = this.getTooltip()
    //this.buttonLabel = this.getButtonLabel()
    
  }
  
  processConnectionToogle(event:any){
    if (this.connected){
      if(!event.target.checked){
        this.mqttService.sendDisconnectMessage()
      }
    } else {
      if(event.target.checked){
        this.mqttService.sendConnectMessage()
        this.searchingHome = true
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
  //quanto demora a conectar a cor do botao toogle se perde e o enable do play tambem
  changeToogleButtonColor(){
    if(this.selectedRobot){
      if(this.status != undefined){
        switch(this.status){
          case FREE:
            document.documentElement.style.setProperty('--toogle-button-color', 'rgb(107, 219, 107)');
            break
          case BUSY:
            document.documentElement.style.setProperty('--toogle-button-color', 'rgb(230, 173, 87)');
            break
          case ERROR:
            document.documentElement.style.setProperty('--toogle-button-color', 'rgb(160, 21, 2)');
            break
          default:
            break
        }
      } else {
        document.documentElement.style.setProperty('--toogle-button-color', 'rgb(214, 211, 211)');
      }
    } else{
      document.documentElement.style.setProperty('--toogle-button-color', 'rgb(214, 211, 211)');
    }
    
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

  getEnableClass(){
    if(this.mqttService.selectedRobot){
      if(this.mqttService.owner){
        if(this.mqttService.owner?.id == this.mqttService.loggedUser?.id){
          return ''
        } else{
          return 'unavailable'
        }
      } else {
        return ''
      }
      
    } else {
      return 'unavailable'
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
      return 'no-robot'
    }
  }

  getTooltip(){
    if(this.status != undefined){
      switch(this.status){
        case FREE:
          return 'Connect to the arm'
        case BUSY:
          if(this.mqttService.owner?.id == this.mqttService.loggedUser?.id){
            if(this.searchingHome){
              return 'Arm is searching home position'
            } else {
              return 'Disconnect from the arm'
            }
          } else {
            if(this.searchingHome){
              return 'Arm is searching home position'
            } else {
              return 'Arm is busy'
            }
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
          if(this.mqttService.owner?.id == this.mqttService.loggedUser?.id){
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

  

  logout(){
    
    if(this.connected){
      var event = {
        target: {
          checked: false
        }
      }
      this.processConnectionToogle(event)
    }
    this.localStorageService.clearLoggedUser()
    this.router.navigate(["/","login"])
  }
}
