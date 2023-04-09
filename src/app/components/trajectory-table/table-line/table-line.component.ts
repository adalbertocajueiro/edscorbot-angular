import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetaInfoObject } from 'src/app/util/matainfo';

@Component({
  selector: 'app-table-line',
  templateUrl: './table-line.component.html',
  styleUrls: ['./table-line.component.scss']
})
export class TableLineComponent {
  @Input()
  trajectory:any

  @Input()
  enableButtons:boolean = false

  @Output()
  onLineClick:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onDeleteClick:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onUseTrajectoryClick:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onAddPointsClick:EventEmitter<any> = new EventEmitter<any>()

  

  lineClicked(){
    this.trajectory.selected = !this.trajectory.selected
    this.onLineClick.emit(this.trajectory)
  }

  timeStampToDate(timestamp:number){
    return new Date(timestamp)
  }

  deleteTrajectory(event:any){
    this.onDeleteClick.emit(event)
  }

  useTrajectory(event:any){
    this.onUseTrajectoryClick.emit(event)
  }

  addPoints(event:any){
    this.onAddPointsClick.emit(event)
  }
}
