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
        mode: 'markers',
        marker: {
            size: 5,
            color: [0],
            colorscale: 'Viridis',
            cmin: -20,
            cmax: 50,
            showscale:true
        },
        type: 'scatter3d'
      }
    ],
    layout: {}
  }

  constructor() { }

  buildPoints(pointList:number[][]){
    console.log('building points')
    this.graph.data[0].x = []
    this.graph.data[0].y = []
    this.graph.data[0].z = []

    var range = pointList.length
    var color = -20
    pointList.forEach( point => {
      var {x,y,z} = robotPointTo3D(point)
      this.graph.data[0].x.push(x)
      this.graph.data[0].y.push(y)
      this.graph.data[0].z.push(z)
      this.graph.data[0].marker.color.push(color)
      color = color + 70/range
    })
    
  }
}
