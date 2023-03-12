import { Injectable } from '@angular/core';
import { robotPointTo3D } from '../util/util';

@Injectable({
  providedIn: 'root'
})


export class GraphService {

  graph:any = {
    data: [
      { x: [0], 
        y: [0], 
        z: [0],
        line: {
          width: 4,
          //color: [0],
          colorscale: "Viridis"}, 
          type: 'scatter3d', 
          //mode: 'lines+points', 
          mode: 'points', 
          marker: {
            size: 5,
            color: [],
            colorscale: "Greens",
            cmin: -20,
            cmax: 50
          } 
        }
    ],
    layout: {}
  }

  constructor() { }

  buildPoints(pointList:number[][]){
    this.graph.data[0].x = []
    this.graph.data[0].y = []
    this.graph.data[0].z = []

    pointList.forEach( point => {
      var {x,y,z} = robotPointTo3D(point)
      this.graph.data[0].x.push(x)
      this.graph.data[0].y.push(y)
      this.graph.data[0].z.push(z)
    })
  }
}
