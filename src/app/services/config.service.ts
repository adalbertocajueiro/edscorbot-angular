import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  serverStatus:"BUSY"|"FREE"|"ERROR" = "FREE"

  connected:"NO"|"YES" = "NO"

  javaApiUrl:string = "http://localhost:8080"

  brokerUrl:string = "tpc://localhost:1833"

  
  
  constructor() { }

  setJavaApiUrl(url:string){
    this.javaApiUrl = url
  }

  setBrokerUrl(url:string){
    this.brokerUrl= url
  }

  setServerStatus(status: "BUSY"|"FREE"|"ERROR"){
    status = status.replaceAll("\"",'') as "BUSY"|"FREE"|"ERROR"
    this.serverStatus = status
  }

  setConnected(con: any){
    //status = status.replaceAll("\"",'') as "BUSY"|"FREE"|"ERROR"
    //this.serverStatus = status
    console.log('connected: ', con)
  }

  toggleConnected(){
     
    if (this.connected === 'NO'){
      //sends message to connect and waits the answer
      this.connected = 'YES'
      this.serverStatus = 'BUSY'
    } else {
      //sends message to disconnect and waits the answer
      this.connected = 'NO'
      this.serverStatus = 'FREE'
    }
  }
}
