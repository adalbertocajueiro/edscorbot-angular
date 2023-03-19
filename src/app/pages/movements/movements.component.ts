import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent implements OnInit{

  simulationPoints:number[][] = []
  simGraphSubject:Subject<any> = new Subject<any>()

  realPoints:number[][] = []
  realGraphSubject:Subject<any> = new Subject<any>()

  toogleChecked:boolean = false

  constructor(private mqttService:EdscorbotMqttServiceService){
    console.log('service', this.mqttService)
  }
  ngOnInit(): void {
    
    this.mqttService.movedSubject.subscribe(
      {
        next: (res) => {
          //console.log('received message', res)
          
          var errorState = res.errorState
          if(!errorState){
            var content = res.content
            this.realPoints.push(content.coordinates)
            this.realGraphSubject.next(this.realPoints)
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )

    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          this.realPoints = []
          this.realGraphSubject.next(this.realPoints)
        },
        error: (err) => { console.log('error',err)}
      }
    )
  }

  updateSimulationGraph(event:any){
    this.simulationPoints = event
    this.simGraphSubject.next(this.simulationPoints)
  }

  switchGraph(event:boolean){
    //false shows the simulated, true shows the real
    this.toogleChecked = event
  }
}
