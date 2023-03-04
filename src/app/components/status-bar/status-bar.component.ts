import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit{

  configServ?:ConfigService

  constructor(private configService:ConfigService, private mqttService:EdscorbotMqttServiceService){
    this.configServ = configService
    this.mqttService.statusSubject.asObservable().subscribe(
      {
        next: (res) => {
          console.log('received: ', res)
          this.configServ?.setServerStatus(res)
        },
        error: (err) => {
          console.log('error: ', err)
        }        
      })
    this.mqttService.connectedSubject.asObservable().subscribe(
      {
        next: (res) => {
          console.log('connected received: ', res)
          this.configServ?.setConnected(res)
        },
        error: (err) => {
          console.log('error: ', err)
        }        
      })

    this.mqttService.disconnectedSubject.asObservable().subscribe(
      {
        next: (res) => {
          console.log('disconnected received: ', res)
          this.configServ?.setConnected(res)
        },
        error: (err) => {
          console.log('error: ', err)
        }        
      })
  }
  ngOnInit(): void {
    this.checkStatus();
  }

  getButtonLabel(){
    return this.configServ?.connected === 'NO'? 'Connect' : 'Disconnect'
  }

  processConnection(){
    this.connect()
    this.configServ!.toggleConnected()
  }

  checkStatus() {
    const publish = {
      topic: 'checkArmStatus',
      qos: 0
    }
    this.mqttService.client.unsafePublish(publish.topic,publish.qos)
  }

  connect() {
    const user = {
      id:'adalberto.cajueiro@gmail.com'
    }
    const publish = {
      topic: 'armConnect',
      qos: 0,
      payload: JSON.stringify(user)
    }
    this.mqttService.client.unsafePublish(publish.topic,publish.payload,publish.qos)
  }
}
