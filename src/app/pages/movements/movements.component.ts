import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent implements OnInit{

  simPointChangedSubject:Subject<void> = new Subject<void>()

  simPointClearSubject:Subject<void> = new Subject<void>()

  simPointAddedSubject:Subject<any> = new Subject<any>()

  simPointDeletedSubject:Subject<number> = new Subject<number>()

  realListSubject:Subject<void> = new Subject<void>()

  clearRealListSubject:Subject<void> = new Subject<void>()

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
          this.realListSubject.next();
        },
        error: (err) => { console.log('error',err)}
      }
    )
  }

  addSimulationPoint(event:any){
    this.simPointAddedSubject.next(event)
  }

  deleteSimulationPoint(event:number){
    this.simPointDeletedSubject.next(event)
  }

  clearSimulationPoints(){
    this.simPointClearSubject.next()
  }

  rebuildGraph(appliedPoints:any){
    console.log('rebuiding graph', appliedPoints)
    this.simPointChangedSubject.next(appliedPoints)
  }
}
