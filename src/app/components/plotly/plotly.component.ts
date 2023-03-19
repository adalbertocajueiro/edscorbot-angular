import { Component, DoCheck, OnInit } from '@angular/core';
import * as Plotly from 'angular-plotly.js/lib/plotly.interface';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss']
})
export class PlotlyComponent implements OnInit{
  
  graph3d?:any

  constructor(private graphService:GraphService){
    this.graph3d = this.graphService.buildGraph([])
  }
  ngOnInit(): void {
   
  }
  
  public graph = {
        data: [
            { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
            { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
        ],
        layout: {width: 320, height: 240, title: 'A Fancy Plot'}
    };

  add(){
    this.graph.data[0].x.push(4)
    this.graph.data[0].y.push(4)
  }
}
