import { Component, Input } from '@angular/core';

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
      selected:false,
      points:[
        {
          j1Ref:4, j2Ref: 4, j3Ref: 4, j4Ref: 4
        },
        {
          j1Ref:5, j2Ref: 5, j3Ref: 5, j4Ref: 5
        },  
        {
          j1Ref:6, j2Ref: 6, j3Ref: 6, j4Ref: 6
        },
        {
          j1Ref:7, j2Ref: 7, j3Ref: 7, j4Ref: 7
        },
        {
          j1Ref:8, j2Ref: 8, j3Ref: 8, j4Ref: 8
        }
      ]
    },
    {
      owner:{
        email:"adalberto.cajueiro@gmail.com"
      },
      date: "2023-02-21",
      selected:false,
      points:[
        {
          j1Ref:4, j2Ref: 4, j3Ref: 4, j4Ref: 4
        },
        {
          j1Ref:5, j2Ref: 5, j3Ref: 5, j4Ref: 5
        },
{
          j1Ref:6, j2Ref: 6, j3Ref: 6, j4Ref: 6
        },
        {
          j1Ref:7, j2Ref: 7, j3Ref: 7, j4Ref: 7
        },
        {
          j1Ref:8, j2Ref: 8, j3Ref: 8, j4Ref: 8
        }
      ]
    }
  ]

  selectedTrajectory?:any

  changeSelectedTrajectory(event:any){
    this.trajectories.filter(t => t.date !== event.date).forEach (t => t.selected = false)
    console.log('trajectories',this.trajectories)
  }

}
