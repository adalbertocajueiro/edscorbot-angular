import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject, Subscription } from 'rxjs';
import { ARM_APPLY_TRAJECTORY, ARM_CANCELED_TRAJECTORY, ARM_CANCEL_TRAJECTORY, ARM_CHECK_STATUS, ARM_CONNECT, ARM_CONNECTED, ARM_DISCONNECT, ARM_DISCONNECTED, ARM_GET_METAINFO, ARM_HOME_SEARCHED, ARM_METAINFO, ARM_MOVE_TO_POINT, ARM_STATUS, BUSY, COMMANDS_CHANNEL, ERROR, FREE, META_INFO_CHANNEL, MOVED_CHANNEL } from '../util/constants';
import { MetaInfoObject } from '../util/matainfo';
import { Client, Point, Trajectory } from '../util/models';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EdscorbotMqttServiceService {

  defaultPointTime: number = 500 //milisseconds
  javaApiUrl: string = "http://localhost:8080"
  brokerUrl: string = "tpc://localhost:1833"
  serverError: boolean = false
  availableRobots: MetaInfoObject[] = []
  selectedRobot?: MetaInfoObject
  loggedUser?: Client

  owner?: Client

  private MQTT_SERVICE_OPTIONS = {
    hostname: environment.broker.hostname,
    port: environment.broker.port,
    clean: environment.broker.clean,
    connectTimeout: environment.broker.connectTimeout,
    reconnectPeriod: environment.broker.reconnectPeriod,
    clientId: "Angular client" + new Date().toLocaleString()
  }

  client: any
  private subscriptionMetainfo: Subscription | undefined;
  private subscriptionCommands: Subscription | undefined;
  private subscriptionMoved: Subscription | undefined;

  metaInfoSubject: Subject<any> = new Subject<any>()
  commandsSubject: Subject<any> = new Subject<any>()
  movedSubject: Subject<any> = new Subject<any>()

  selectedRobotSubject: Subject<any> = new Subject<any>()

  _mqttService: MqttService

  constructor(private localStorageService: LocalStorageService) {
    var localStorageUser = localStorageService.getLoggedUser()
    if (localStorageUser) {
      this.loggedUser = {
        id: localStorageUser.username!
      }
    }
    this.localStorageService.userChanged.subscribe({
      next: (res: any) => {
        if (res == undefined) {
          this.loggedUser = undefined
        } else {
          this.loggedUser = {
            id: res.username
          }
        }
      },
      error: (err: any) => { console.log('error', err) }
    })

    var mqttClientId = new Date().toLocaleString()
    this.MQTT_SERVICE_OPTIONS.clientId = mqttClientId
    this._mqttService = new MqttService(this.MQTT_SERVICE_OPTIONS)
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
    })
  }


  subscribeMetainfo() {
    const subscriptionMetainfo = {
      topic: META_INFO_CHANNEL,
      qos: 0
    }

    this.subscriptionMetainfo = this.client?.observe(subscriptionMetainfo.topic, subscriptionMetainfo.qos)
      .subscribe((message: IMqttMessage) => {
        var metainfo = JSON.parse(message.payload.toString())
        if (metainfo.signal == ARM_METAINFO) {
          this.addRobot(metainfo)
          this.metaInfoSubject.next(this.availableRobots)
        }
      })
  }

  subscribeCommands(robotName: string) {
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

  subscribeMoved(robotName: string) {
    const subscriptionMoved = {
      topic: robotName + "/" + MOVED_CHANNEL,
      qos: 0
    }

    this.subscriptionMoved = this.client?.observe(subscriptionMoved.topic, subscriptionMoved.qos)
      .subscribe((message: IMqttMessage) => {
        var payload = JSON.parse(message.payload.toString())
        this.movedSubject.next(payload);
      })
  }

  unsubscribeMetainfo() {
    this.subscriptionMetainfo?.unsubscribe()
  }
  unsubscribeCommands() {
    this.subscriptionCommands?.unsubscribe()
  }
  unsubscribeMoved() {
    this.subscriptionMoved?.unsubscribe()
  }

  addRobot(metainfo: MetaInfoObject) {
    if (this.availableRobots.filter(mi => mi.name === metainfo.name).length == 0) {
      this.availableRobots.push(metainfo)
    }
  }
  selectRobot(robot: MetaInfoObject | undefined) {
    if (!robot) {
      if (this.selectedRobot) {
        this.unsubscribeCommands()
        this.unsubscribeMoved()
      }
      this.selectedRobot = undefined
      this.selectedRobotSubject.next(this.selectedRobot)
    } else {
      this.selectedRobot = robot
      //unsubscribe on all other robots
      this.availableRobots.forEach(r => {
        if (r.name != this.selectedRobot?.name) {
          this.unsubscribeCommands()
          this.unsubscribeMoved()
        }
      })
      this.subscribeCommands(robot.name)
      this.sendRequestStatusMessage()
    }
    this.selectedRobotSubject.next(this.selectRobot)
  }

  selectRobotByName(name: string) {
    var found = this.availableRobots.find(r => r.name === name)
    this.selectRobot(found)
  }

  processCommand(commandObj: any) {
    if (commandObj.signal == ARM_STATUS
      || commandObj.signal == ARM_CONNECTED
      || commandObj.signal == ARM_CANCELED_TRAJECTORY
      || commandObj.signal == ARM_DISCONNECTED
      || commandObj.signal == ARM_HOME_SEARCHED) {

      if (commandObj.error) {
        this.serverError = true
      } else {
        if (commandObj.signal == ARM_STATUS) {
          this.owner = commandObj.client
          this.serverError = commandObj.error
        }
        if (commandObj.signal == ARM_CONNECTED) {
          this.owner = commandObj.client
          if (this.owner?.id == this.loggedUser?.id) {
            this.subscribeMoved(this.selectedRobot!.name)
          }
        }

        if (commandObj.signal == ARM_HOME_SEARCHED) {
          this.serverError = commandObj.error
        }
        if (commandObj.signal == ARM_DISCONNECTED) {
          this.owner = undefined
        }
      }
      this.commandsSubject.next(commandObj)
    }
  }

  sendRequestMetaInfo() {
    if (this.selectedRobot == undefined) {
      const content = {
        signal: ARM_GET_METAINFO
      }
      const publish = {
        topic: META_INFO_CHANNEL,
        qos: 0,
        payload: JSON.stringify(content)
      }
      this.client.unsafePublish(publish.topic, publish.payload, publish.qos)
    }
  }

  sendRequestStatusMessage() {
    if (this.selectedRobot) {
      const content = {
        signal: ARM_CHECK_STATUS,
        client: this.loggedUser
      }
      const publish = {
        topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
        qos: 0,
        payload: JSON.stringify(content)
      }
      this.client.unsafePublish(publish.topic, publish.payload, publish.qos)
    }
  }

  sendConnectMessage() {
    const content = {
      signal: ARM_CONNECT,
      client: this.loggedUser
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic, publish.payload, publish.qos)
  }

  sendTrajectoryMessage(trajectory: Trajectory) {
    const content = {
      signal: ARM_APPLY_TRAJECTORY,
      client: this.loggedUser,
      trajectory: trajectory
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic, publish.payload, publish.qos)
  }

  sendMoveToPointMessage(point: Point) {
    const content = {
      signal: ARM_MOVE_TO_POINT,
      client: this.loggedUser,
      point: point
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic, publish.payload, publish.qos)
  }

  sendCancelTrajectoryMessage() {
    const content = {
      signal: ARM_CANCEL_TRAJECTORY,
      client: this.loggedUser
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic, publish.payload, publish.qos)
  }

  sendDisconnectMessage() {
    const content = {
      signal: ARM_DISCONNECT,
      client: this.loggedUser
    }
    const publish = {
      topic: this.selectedRobot!.name + "/" + COMMANDS_CHANNEL,
      qos: 0,
      payload: JSON.stringify(content)
    }
    this.client.unsafePublish(publish.topic, publish.payload, publish.qos)
  }
}
