import { Injectable } from '@angular/core';
import { IClientSubscribeOptions } from 'mqtt';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EdscorbotMqttServiceService {

  client:any
  private subscriptionStatus: Subscription | undefined;
  private subscriptionConnected: Subscription | undefined;
  private subscriptionDisconnect: Subscription | undefined;

  statusSubject:Subject<any> = new Subject<any>()
  connectedSubject:Subject<any> = new Subject<any>()
  disconnectedSubject:Subject<any> = new Subject<any>()

  constructor(private _mqttService: MqttService){
    this.client = _mqttService
    this.createConnection()
    this.subscribe();
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
      console.log(`Received message ${packet.payload.toString()} from topic ${packet.topic}`)
    })
  }

  subscribe() {
    const subscriptionStatus = {
      topic: 'armStatus',
      qos: 0
    }
    
    this.subscriptionStatus = this.client?.observe(subscriptionStatus.topic, subscriptionStatus.qos)
      .subscribe((message: IMqttMessage) => {
        var payload = message.payload
        console.log('status received: ', payload.toString())
        this.statusSubject.next(payload.toString());
      })

    const subscriptionConnected = {
      topic: 'armConnected',
      qos: 0
    }
    this.subscriptionConnected = this.client?.observe(subscriptionConnected.topic, subscriptionConnected.qos)
      .subscribe((message: IMqttMessage) => {
        var payload = message.payload
        console.log('connected received: ', payload.toString())
        this.connectedSubject.next(payload.toString());
      })

    const subscriptionDisconnect = {
      topic: 'armDisconnected',
      qos: 0
    }
    this.subscriptionDisconnect = this.client?.observe(subscriptionDisconnect.topic, subscriptionDisconnect.qos)
      .subscribe((message: IMqttMessage) => {
        var payload = message.payload
        console.log('connected received: ', payload.toString())
        this.disconnectedSubject.next(payload.toString());
      })
  }

  
}
