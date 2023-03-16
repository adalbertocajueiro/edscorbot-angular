import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject, Subscription } from 'rxjs';
import { ARM_APPLY_TRAJECTORY, ARM_CANCEL_TRAJECTORY, ARM_CHECK_STATUS, ARM_CONNECT, ARM_CONNECTED, ARM_DISCONNECT, ARM_DISCONNECTED, ARM_METAINFO, ARM_MOVE_TO_POINT, ARM_STATUS, BUSY, COMMANDS_CHANNEL, ERROR, FREE, META_INFO_CHANNEL, MOVED_CHANNEL } from '../util/constants';
import { MetaInfoObject } from '../util/matainfo';
import { Client, Point, Trajectory } from '../util/models';

@Injectable({
  providedIn: 'root'
})
export class EdscorbotMqttServiceService {

  defaultPointTime:number = 500 //milisseconds
  javaApiUrl:string = "http://localhost:8080"
  brokerUrl:string = "tpc://localhost:1833"
  serverStatus?: number
  connected: boolean = false
  buttonLabel:string = 'Robot not selected'
  enableButtonConnect:boolean = false
  availableRobots:MetaInfoObject[] = []
  selectedRobot?:MetaInfoObject
  loggedUser:Client = {
    id: "adalberto@computacao.ufcg.edu.br"
  }

  private MQTT_SERVICE_OPTIONS1 = {
  hostname: 'localhost',
   port: 8080,
   //path: '/mqtt',
   clean: true, // Retain session
   connectTimeout: 4000, // Timeout period
   reconnectPeriod: 4000, // Reconnect period
   // Authentication information
   clientId: 'mqttx_597046f4',
   //protocol: 'ws',
}

  client:any
  private subscriptionMetainfo: Subscription | undefined;
  private subscriptionCommands: Subscription | undefined;
  private subscriptionMoved: Subscription | undefined;

  metaInfoSubject:Subject<any> = new Subject<any>()
  commandsSubject:Subject<any> = new Subject<any>()
  movedSubject:Subject<any> = new Subject<any>()

  selectedRobotSubject:Subject<any> = new Subject<any>()

  _mqttService: MqttService

  constructor(){
    var mqttClientId = new Date().toLocaleString()
    this.MQTT_SERVICE_OPTIONS1.clientId = mqttClientId
    this._mqttService = new MqttService(this.MQTT_SERVICE_OPTIONS1)
    this.client = this._mqttService
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
      this.notifyClients(packet)
    })
  }

  notifyClients(packet:any){
    var payloadObj = JSON.parse(packet.payload.toString())
    if(packet.topic.toString().includes(META_INFO_CHANNEL)){
      if(payloadObj.signal == ARM_METAINFO){
        this.metaInfoSubject.next(payloadObj)
      }    
    } else if (packet.topic.toString().includes(COMMANDS_CHANNEL)){
      if(payloadObj.signal == ARM_CONNECTED 
          || payloadObj.signal == ARM_STATUS
          || payloadObj.signal == ARM_DISCONNECTED){

            this.commandsSubject.next(payloadObj)
          }
      
    } else if (packet.topic.toString().includes(MOVED_CHANNEL)) {
      this.movedSubject.next(payloadObj)
    }
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
        if(payload){
          var payload = JSON.parse(payload.toString())
          this.movedSubject.next(payload);
        }
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
      if(this.selectedRobot){
        this.unsubscribeCommands()
        this.unsubscribeMoved()
      }
      this.selectedRobot = undefined
      this.enableButtonConnect = false
      this.serverStatus = undefined
      this.connected = false
      this.buttonLabel = 'Robot not selected'

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
      this.subscribeMoved(robot.name)

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
    this.selectedRobotSubject.next(this.selectedRobot)
  }

  selectRobotByName(name:string){
    var found = this.availableRobots.find( r => r.name === name)
    this.selectRobot(found)
  }

  processCommand(commandObj:any){
    if(commandObj.error) {
      this.serverStatus = ERROR
      this.enableButtonConnect = false
      this.buttonLabel = 'Wait'
      this.connected = false
    } else {
      if(commandObj.signal == ARM_STATUS){
        if(commandObj.client){
          this.serverStatus = BUSY
          if(commandObj.client.id == this.loggedUser.id){
            this.buttonLabel = 'Disconnect'
            this.connected = true
            this.enableButtonConnect = true
          } else {
            this.buttonLabel = 'Wait'
            this.connected = false
            this.enableButtonConnect = false
          }
        } else {
          this.serverStatus = FREE
          this.enableButtonConnect = true
          if(this.selectedRobot){
            this.buttonLabel = 'Connect'
          } else {
            this.buttonLabel = 'Robot not selected'
          }
        }
      }
    }
    
    if(commandObj.signal == ARM_CONNECTED){
      if(commandObj.client.id == this.loggedUser.id){
        this.buttonLabel = 'Disconnect'
        this.connected = true
        this.enableButtonConnect = true
        this.serverStatus = BUSY
      } else {
        this.enableButtonConnect = false;
        this.buttonLabel = 'Wait'
        this.connected = false
      } 
    }

    if(commandObj.signal == ARM_DISCONNECTED){
      this.serverStatus = FREE
      this.connected = false
      this.enableButtonConnect = true
      this.buttonLabel = 'Connect'
      this.selectRobot(undefined)
    }
  }
  
  sendRequestStatusMessage(){
    if(this.selectedRobot){
      const content = {
        signal: ARM_CHECK_STATUS,
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

  sendTrajectoryMessage(trajectory:Trajectory){
    const content = {
      signal: ARM_APPLY_TRAJECTORY,
      client: this.loggedUser,
      content: trajectory
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic,publish.payload,publish.qos)
  }

  sendMoveToPointMessage(point:Point){
    const content = {
      signal: ARM_MOVE_TO_POINT,
      client: this.loggedUser,
      content: point
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic,publish.payload,publish.qos)
  }

  sendCancelTrajectoryMessage(){
    const content = {
      signal: ARM_CANCEL_TRAJECTORY,
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
