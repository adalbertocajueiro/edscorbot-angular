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
        [4,4,4,4,4,4,100],
        [5,5,5,5,5,5,100],  
        [6,6,6,6,6,6,100],
        [7,7,7,7,7,7,100],
        [8,8,8,8,8,8,100]
      ]
    },
    {
      owner:{
        email:"adalberto.cajueiro@gmail.com"
      },
      date: "2023-02-21",
      points:[
        [14,14,14,14,14,14,100],
        [15,15,15,15,15,15,100],  
        [16,16,16,16,16,16,100],
        [17,17,17,17,17,17,100],
        [18,18,18,18,18,18,100]
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
