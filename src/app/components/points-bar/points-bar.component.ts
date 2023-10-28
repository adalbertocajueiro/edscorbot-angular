import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-points-bar',
  templateUrl: './points-bar.component.html',
  styleUrls: ['./points-bar.component.scss']
})
export class PointsBarComponent implements OnInit{

  @Input()
  addPointSubject?:Subject<number>;

  @Input()
  removePointSubject?: Subject<number>;

  @Input()
  clearPointSubject?: Subject<number>;

  @Output()
  pointSelectedSubject: EventEmitter<number> = new EventEmitter<number>();

  points:number[] = []
  
  selectedPoint?:number

  constructor(){
  }
  ngOnInit(): void {
    this.addPointSubject?.subscribe({
      next:(res) => {
        this.points.push(this.points.length + 1)
      }
    })
    this.removePointSubject?.subscribe({
      next: (res) => { console.log('remove point') }
    })
    this.clearPointSubject?.subscribe({
      next: (res) => { 
        this.points = [] 
      }
    })
  }
  
  pointClicked(point:number){
    this.selectedPoint = point
    this.pointSelectedSubject.emit(point)
  }

  previousClicked(){
    this.selectedPoint = this.selectedPoint! - 1
    this.pointSelectedSubject.emit(this.selectedPoint)
  }

  nextClicked() {
    this.selectedPoint = this.selectedPoint! + 1
    this.pointSelectedSubject.emit(this.selectedPoint)
  }
}
