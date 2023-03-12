import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-trajectory-table',
  templateUrl: './trajectory-table.component.html',
  styleUrls: ['./trajectory-table.component.scss']
})
export class TrajectoryTableComponent {

  @Input()
  trajectories:any[] = [
    {
      owner:{
        email:"adalberto.cajueiro@gmail.com"
      },
      date: "2023-02-20",
      points:[
        [4,4,4,4,4,4],
        [5,5,5,5,5,5],  
        [6,6,6,6,6,6],
        [7,7,7,7,7,7],
        [8,8,8,8,8,8]
      ]
    },
    {
      owner:{
        email:"adalberto.cajueiro@gmail.com"
      },
      date: "2023-02-21",
      points:[
        [14,14,14,14,14,14],
        [15,15,15,15,15,15],  
        [16,16,16,16,16,16],
        [17,17,17,17,17,17],
        [18,18,18,18,18,18]
      ]
    }
  ]

  selectedTrajectory?:any

  @Output()
  onSelectedTrajectory: EventEmitter<any> = new EventEmitter<any>()

  changeSelectedTrajectory(event:any){
    this.selectedTrajectory = event
    this.onSelectedTrajectory.emit(this.selectedTrajectory)
  }

}
