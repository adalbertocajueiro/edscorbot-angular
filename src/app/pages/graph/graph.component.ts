import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit{
    graph = {
        data: [
            { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
            { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
        ],
        layout: {
          autosize: false,
          width: 320, 
          height: 240,
          title: 'Data'
        }
    };

    constructor(){}
    ngOnInit(): void {
      this.graph = this.buildGraphObject()
    }

    buildGraphObject(){
      var pointCount = 31;
      var i, r;
      var x = [];
      var y = [];
      var z = [];
      var c = [];

      for(i = 0; i < pointCount; i = i + 0.2){
        r = 10 * Math.cos(i / 25);
        x.push(r * Math.cos(i));
        y.push(r * Math.sin(i));
        z.push(i);
        c.push(i)
      }
      var graph:any = {
        data: [
            { x: x, 
              y: y, 
              z: z,
              line: {
                width: 6,
                color: c,
                colorscale: "Viridis"}, 
              type: 'scatter3d', 
              mode: 'lines+points', 
              marker: {
                size: 3.5,
                color: c,
                colorscale: "Greens",
                cmin: -20,
                cmax: 50
              } }
        ],
        layout: {}
      }

      return graph
    }
}
