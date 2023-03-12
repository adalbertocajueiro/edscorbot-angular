import { Component } from '@angular/core';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-graphplot',
  templateUrl: './graphplot.component.html',
  styleUrls: ['./graphplot.component.scss']
})
export class GraphplotComponent {

  graphServ?:GraphService

  constructor(private graphService:GraphService){
    this.graphServ = this.graphService
  }
  
}
