import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent implements OnInit{

  simPointSubject:Subject<any> = new Subject<any>()

  realPointSubject:Subject<any> = new Subject<any>()

  toogleChecked:boolean = false

  constructor(private mqttService:EdscorbotMqttServiceService){
    
  }
  ngOnInit(): void {
    
    this.mqttService.movedSubject.subscribe(
      {
        next: (res) => {
          var errorState = res.errorState
          if(!errorState){
            var returnedPoint = res.content.coordinates
            this.realPointSubject.next(returnedPoint)
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )

    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          //TODO some action with real points
        },
        error: (err) => { console.log('error',err)}
      }
    )
  }

  addSimulationPoint(event:any){
    this.simPointSubject.next(event)
  }
}
