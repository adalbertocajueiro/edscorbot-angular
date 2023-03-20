import { Injectable } from '@angular/core';
import { cinematicFunctions} from '../util/util';
import { EdscorbotMqttServiceService } from './edscorbot-mqtt-service.service';

@Injectable({
  providedIn: 'root'
})


export class GraphService {

  /*
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
  */

  constructor( private mqttService:EdscorbotMqttServiceService) { }

  buildGraph(pointList:number[][]){

    var graph:any = {
      data: [
        { x: [0], 
          y: [0], 
          z: [0],
          mode: 'markers',
          marker: {
              size: 8,
              color: [127],
              symbol: 'circle-open',
              colorscale: 'Blues',
              sizemode: 'diameter',
              
              opacity: 0.6
              
          },
          type: 'scatter3d',
          
        }
      ],
      layout: {}
    }

    graph.data[0].x = []
    graph.data[0].y = []
    graph.data[0].z = []

    var range = pointList.length
    var color = graph.data[0].marker.color[0]
    pointList.forEach( point => {
      var robotName = this.mqttService.selectedRobot?.name
      if(robotName){
        var cinematicFunction = cinematicFunctions.get(robotName)
        if(cinematicFunction){
          var {x,y,z} = cinematicFunction(point)
          graph.data[0].x.push(x)
          graph.data[0].y.push(y)
          graph.data[0].z.push(z)
          graph.data[0].marker.color.push(color)
        }
      }   
    })
  
    return graph
  }

  addPointToRealTrace(simPointList:number[][], realPointList:number[][]){
    //console.log('sim points', simPointList)
    //console.log('real points', realPointList)
    var graph:any = {
      data: [
        { x: [0], 
          y: [0], 
          z: [0],
          mode: 'markers',
          marker: {
              size: 8,
              color: [127],
              symbol: 'circle-open',
              colorscale: 'Blues',
              sizemode: 'diameter',
              
              opacity: 0.6
              
          },
          type: 'scatter3d',
          
        },
        { x: [0], 
          y: [0], 
          z: [0],
          mode: 'markers',
          marker: {
              size: 8,
              color: [127],
              symbol: 'circle',
              colorscale: 'Greens',
              sizemode: 'area',
              opacity: 0.6
              
          },
          type: 'scatter3d',
          
        }
      ],
      layout: {}
    }

    graph.data[0].x = []
    graph.data[0].y = []
    graph.data[0].z = []

    var range = simPointList.length
    var color = graph.data[0].marker.color[0]
    simPointList.forEach( point => {
      var robotName = this.mqttService.selectedRobot?.name
      if(robotName){
        var cinematicFunction = cinematicFunctions.get(robotName)
        if(cinematicFunction){
          var {x,y,z} = cinematicFunction(point)
          graph.data[0].x.push(x)
          graph.data[0].y.push(y)
          graph.data[0].z.push(z)
          graph.data[0].marker.color.push(color)
        }
      }   
    })

    graph.data[1].x = []
    graph.data[1].y = []
    graph.data[1].z = []

    var color = graph.data[1].marker.color[0]
    realPointList.forEach( point => {
      var robotName = this.mqttService.selectedRobot?.name
      if(robotName){
        var cinematicFunction = cinematicFunctions.get(robotName)
        if(cinematicFunction){
          var {x,y,z} = cinematicFunction(point)
          graph.data[1].x.push(x)
          graph.data[1].y.push(y)
          graph.data[1].z.push(z)
          graph.data[1].marker.color.push(color)
        }
      }   
    })


  
    return graph
  }

  addPoint(graph:any, point:number[]){
    var lastColor = [...graph.data[0].marker.color].pop() + 0.1
    var robotName = this.mqttService.selectedRobot?.name
      if(robotName){
        var cinematicFunction = cinematicFunctions.get(robotName)
        if(cinematicFunction){
          var {x,y,z} = cinematicFunction(point)
          graph.data[0].x.push(x)
          graph.data[0].y.push(y)
          graph.data[0].z.push(z)
          graph.data[0].marker.color.push(lastColor)
        }
      } 
  }
}
