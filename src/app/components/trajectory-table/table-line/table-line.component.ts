import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-line',
  templateUrl: './table-line.component.html',
  styleUrls: ['./table-line.component.scss']
})
export class TableLineComponent {
  @Input()
  trajectory:any

  @Output()
  onLineClick:EventEmitter<any> = new EventEmitter<any>()

  toggleTRajectory(){
    this.trajectory.selected = !this.trajectory.selected
    this.onLineClick.emit(this.trajectory)
  }
}
