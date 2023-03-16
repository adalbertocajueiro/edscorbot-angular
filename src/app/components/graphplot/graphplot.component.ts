import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-graphplot',
  templateUrl: './graphplot.component.html',
  styleUrls: ['./graphplot.component.scss']
})
export class GraphplotComponent implements  OnInit{

  @Input()
  graphSubject?: Subject<any>

  graph?: any

  constructor( private graphService:GraphService){

  }
  
  ngOnInit(): void {

    this.graphSubject?.subscribe(
      {
        next:(res) => {
          this.graph = this.graphService.buildGraph(res)
        },
        error: (err) => {console.log('error',err)}
      }
    )
  }
  
}
