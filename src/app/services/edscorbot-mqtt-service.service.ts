import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject, Subscription } from 'rxjs';
import { ARM_CHECK_STATUS, ARM_CONNECT, ARM_CONNECTED, ARM_DISCONNECT, ARM_DISCONNECTED, ARM_METAINFO, ARM_STATUS, BUSY, COMMANDS_CHANNEL, ERROR, FREE, META_INFO_CHANNEL, MOVED_CHANNEL } from '../util/constants';
import { MetaInfoObject } from '../util/matainfo';
import { Client } from '../util/models';

@Injectable({
  providedIn: 'root'
})
export class EdscorbotMqttServiceService {

  defaultPointTime:number = 500 //milisseconds
  javaApiUrl:string = "http://localhost:8080"
  brokerUrl:string = "tpc://localhost:1833"
  serverStatus?: "BUSY"|"FREE"|"ERROR" = undefined
  connected:"NO"|"YES" = 'NO'
  buttonLabel:string = "Connect"
  enableButtonConnect:boolean = false
  availableRobots:MetaInfoObject[] = []
  selectedRobot?:MetaInfoObject
  loggedUser:Client = {
    id: "adalberto@computacao.ufcg.edu.br"
  }

  client:any
  private subscriptionMetainfo: Subscription | undefined;
  private subscriptionCommands: Subscription | undefined;
  private subscriptionMoved: Subscription | undefined;

  metaInfoSubject:Subject<any> = new Subject<any>()
  commandsSubject:Subject<any> = new Subject<any>()
  movedSubject:Subject<any> = new Subject<any>()

  robotSelectedSubject:Subject<any> = new Subject<any>()
  updateStatusBar:Subject<string> = new Subject<string>()

  constructor(private _mqttService: MqttService){
    this.client = _mqttService
    this.createConnection()
    this.subscribeMetainfo()
  }
  createConnection() {
    try {
      this.client?.connect()
    } catch (error) {
      console.log('mqtt.connect error', error);
    }
    this.client?.onConnect.subscribe(() => {
      console.log('Connection succeeded!');
    });
    this.client?.onError.subscribe((error: any) => {
      console.log('Connection failed', error);
    });
    this.client?.onMessage.subscribe((packet: any) => {
      console.log(`Received message ${packet.payload} from topic ${packet.topic}`)
    })
  }

  subscribeMetainfo(){
    const subscriptionMetainfo = {
      topic: META_INFO_CHANNEL,
      qos: 0
    }

    this.subscriptionMetainfo = this.client?.observe(subscriptionMetainfo.topic, subscriptionMetainfo.qos)
      .subscribe((message: IMqttMessage) => {
        var payload = JSON.parse(message.payload.toString())
        this.addRobot(payload)
      })
  }

  subscribeCommands(robotName:string){
   const subscriptionCommands = {
        topic: robotName + "/" + COMMANDS_CHANNEL,
        qos: 0
      }
      this.subscriptionCommands = this.client?.observe(subscriptionCommands.topic, subscriptionCommands.qos)
      .subscribe((message: IMqttMessage) => {
        var payload = JSON.parse(message.payload.toString())
        this.processCommand(payload);
        this.commandsSubject.next(payload);
      })
  }

  subscribeMoved(robotName:string){
   const subscriptionMoved = {
        topic: robotName + "/" + MOVED_CHANNEL,
        qos: 0
      }
      this.subscriptionMoved = this.client?.observe(subscriptionMoved.topic, subscriptionMoved.qos)
      .subscribe((message: IMqttMessage) => {
        var payload = JSON.parse(payload.toString())
        this.movedSubject.next(payload);
      })
  }

  unsubscribeMetainfo(){
    this.subscriptionMetainfo?.unsubscribe()
  }
  unsubscribeCommands(){
    this.subscriptionCommands?.unsubscribe()
  }
  unsubscribeMoved(){
    this.subscriptionMoved?.unsubscribe()
  }

  addRobot(metainfo:MetaInfoObject){
    if(metainfo.signal == ARM_METAINFO){
      if (this.availableRobots.filter(mi => mi.name === metainfo.name).length == 0){
        this.availableRobots.push(metainfo)
      }
    } 
  }
  selectRobot(robot:MetaInfoObject | undefined){
    if(!robot){
      this.selectedRobot = undefined
    } else {
      this.selectedRobot = robot
      //unsubscribe on all other robots
      this.availableRobots.forEach( r => {
        if (r.name != this.selectedRobot?.name){
          this.unsubscribeCommands()
          this.unsubscribeMoved()
        }
      })
      this.subscribeCommands(robot.name)
      const content = {
        signal: ARM_CHECK_STATUS
      }

      const publish = {
        topic: this.selectedRobot.name + "/" + COMMANDS_CHANNEL,
        qos: 0,
        payload: JSON.stringify(content)
      }
      this.client.unsafePublish(publish.topic,publish.payload,publish.qos)
    }
  }

  selectRobotByName(name:string){
    var found = this.availableRobots.find( r => r.name === name)
    this.selectRobot(found)
  }

  processCommand(commandObj:any){
    switch(commandObj.signal){
      case ARM_STATUS:
        this.updateStatusAndEnableButton(commandObj)
        this.updateConnected(commandObj)
        break
      case ARM_CONNECTED:
        this.updateConnected(commandObj)
        break
      case ARM_DISCONNECTED:
        this.updateStatusAndEnableButton(commandObj)
        this.updateConnected(commandObj)
        break
    }
  }
  updateStatusAndEnableButton(commandObj:any){
    if(commandObj.error){
      this.serverStatus = "ERROR"
    } else if (commandObj.client) {
      this.serverStatus = "BUSY"
    } else {
      this.serverStatus = "FREE"
      this.buttonLabel = 'Connect'
      this.enableButtonConnect = true
    }
  }

  updateConnected(commandObj:any){
    if(commandObj.client){
      if(commandObj.client?.id == this.loggedUser?.id){
        this.buttonLabel = 'Disconnect'
        this.connected = "YES"
        this.serverStatus = "BUSY"
      } else {
        this.enableButtonConnect = false;
        this.connected = "NO"
      }
    } else {
      this.connected = "NO"
    }
  }

  sendConnectMessage(){
    const content = {
      signal: ARM_CONNECT,
      client: this.loggedUser
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic,publish.payload,publish.qos)
  }

  sendDisconnectMessage(){
    const content = {
      signal: ARM_DISCONNECT,
      client: this.loggedUser
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic,publish.payload,publish.qos)
  }
}
