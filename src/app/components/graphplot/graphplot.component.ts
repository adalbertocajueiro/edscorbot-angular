import { AfterViewInit, ChangeDetectionStrategy, Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-graphplot',
  templateUrl: './graphplot.component.html',
  styleUrls: ['./graphplot.component.scss']
})
export class GraphplotComponent implements  OnInit {

  @Input()
  simGraphSubject?: Subject<any>
  simPoints:number[][] = []

  @Input()
  realGraphSubject?: Subject<any>
  realPoints:number[][] = []

  graph?: any

  constructor( private graphService:GraphService){

  }
  
  ngOnInit(): void {
    var canvas = document.getElementsByTagName('canvas')
    this.simGraphSubject?.subscribe(
      {
        next:(res) => {
          this.simPoints = res
          this.graph = this.graphService.buildGraph(res)
        },
        error: (err) => {console.log('error',err)}
      }
    )
    this.realGraphSubject?.subscribe(
      {
        next:(res) => {
          this.realPoints = res
          this.graph = this.graphService.addPointToRealTrace(this.simPoints, this.realPoints)

        },
        error: (err) => {console.log('error',err)}
      }
    )
  }
  
}
