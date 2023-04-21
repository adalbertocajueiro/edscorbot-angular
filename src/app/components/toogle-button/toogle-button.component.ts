import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { BUSY, ERROR, FREE } from 'src/app/util/constants';

@Component({
  selector: 'app-toogle-button',
  templateUrl: './toogle-button.component.html',
  styleUrls: ['./toogle-button.component.scss']
})
export class ToogleButtonComponent{
  
  @Input()
  tooltip:string = ''

  @Input()
  enabled:boolean = false

  @Input()
  connected:boolean = false

  @Input()
  searchingHome:boolean = false

  @Output()
  onToggleChanged:EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(private mqttService:EdscorbotMqttServiceService){

  }
  toggleChanged(event:any){
    this.onToggleChanged.emit(event)
  }

  
}
