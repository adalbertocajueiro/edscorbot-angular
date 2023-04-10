import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetaInfoObject } from 'src/app/util/matainfo';

@Component({
  selector: 'app-trajectory-table',
  templateUrl: './trajectory-table.component.html',
  styleUrls: ['./trajectory-table.component.scss']
})
export class TrajectoryTableComponent {

  @Input()
  trajectories:any[] = []

  selectedTrajectory?:any

  @Input()
  selectedRobot?:MetaInfoObject

  @Output()
  onSelectTrajectory: EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onDeleteTrajectory: EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onUseTrajectory:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onAddPoints:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onSortByUsername:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onSortByDate:EventEmitter<any> = new EventEmitter<any>()

  
  changeSelectedTrajectory(event:any){
    this.selectedTrajectory = event
    this.onSelectTrajectory.emit(this.selectedTrajectory)
  }

  deleteTrajectory(event:any){
    this.onDeleteTrajectory.emit(event)
  }

  useTrajectory(event:any){
    this.onUseTrajectory.emit(event)
  }

  addPoints(event:any){
    this.onAddPoints.emit(event)
  }

}
