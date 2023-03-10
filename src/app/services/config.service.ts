import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FREE, BUSY, ERROR, ARM_METAINFO, ARM_STATUS } from '../util/constants';
import { MetaInfoObject } from '../util/matainfo';

@Injectable({
  providedIn: 'root'
})


export class ConfigService {


  serverStatus?: "BUSY"|"FREE"|"ERROR" = undefined
  connected?:"NO"|"YES" = undefined
  buttonLabel:string = "Connect"
  enableButtonConnect:boolean = false
  loggedUser:string = "adalberto@computacao.ufcg.edu.br"
  

  javaApiUrl:string = "http://localhost:8080"

  brokerUrl:string = "tpc://localhost:1833"

  availableRobots:MetaInfoObject[] = []

  selectedRobot?:MetaInfoObject
  
  robotSelectedSubject:Subject<any> = new Subject<any>()

  constructor() { }

  setJavaApiUrl(url:string){
    this.javaApiUrl = url
  }

  setBrokerUrl(url:string){
    this.brokerUrl= url
  }

  addRobot(metainfo:MetaInfoObject){
    if(metainfo.signal == ARM_METAINFO){
      if (this.availableRobots.filter(mi => mi.name === metainfo.name).length == 0){
        this.availableRobots.push(metainfo)
      }
    } 
  }

  selectRobot(robot:MetaInfoObject){
    this.selectedRobot = robot
    this.robotSelectedSubject.next(this.selectedRobot)
  }
  setServerStatus(statusObj:any){
    if(statusObj.signal == ARM_STATUS){
      switch(statusObj.status){
        case FREE:
          this.serverStatus = "FREE"
          this.buttonLabel = 'Connect'
          this.enableButtonConnect = true
          break
        case BUSY:
          this.serverStatus = "BUSY"
          var client = statusObj.client
          if(client.id == this.loggedUser){
            this.buttonLabel = 'Disconnect'
          } else {
            this.enableButtonConnect = false;
          }
          break
        case ERROR:
          this.serverStatus = "ERROR"
          break
      }
    }
  }

  setConnected(con: any){
    console.log('connected: ', con)
  }

  toggleConnected(){
     
    if (this.connected === 'NO'){
      this.connected = 'YES'
      this.serverStatus = 'BUSY'
    } else {
      //sends message to disconnect and waits the answer
      this.connected = 'NO'
      this.serverStatus = 'FREE'
    }
  }
}
