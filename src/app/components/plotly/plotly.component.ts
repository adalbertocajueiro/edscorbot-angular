import { Component, Input, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min'
import { Subject } from 'rxjs';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { cinematicFunctions } from 'src/app/util/util';

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss']
})
export class PlotlyComponent implements OnInit{
  
  data:Plotly.Data[] = []
  showLegend:boolean = true
  simulatedTrace:Plotly.Data = {}
  realTrace:Plotly.Data = {}

  @Input()
  simPointSubject?:Subject<any>

  @Input()
  simPointDeletedSubject?:Subject<number>

  @Input()
  realPointSubject?:Subject<any>

  @Input()
  simListSubject?:Subject<void>

   @Input()
  realListSubject?:Subject<void>

  constructor(private mqttService:EdscorbotMqttServiceService){
    
  }
  ngOnInit(): void {
    this.createInitialGraph()
    this.simPointSubject?.subscribe(
      {
        next: (point) => {
          this.addSimPoint(point)
        },
        error: (err) => {console.log('error',err)}
      }
    )

    this.simPointDeletedSubject?.subscribe(
      {
        next: (index) => {
          this.deleteSimPoint(index)
        },
        error: (err) => {console.log('error',err)}
      }
    )

    this.simListSubject?.subscribe(
      {
        next: () => {
          //console.log('rebuilding graphs')
          this.data = []
          this.createInitialGraph()
        },
        error: (err) => {console.log('error',err)}
      }
    )

    this.realListSubject?.subscribe(
      {
        next: () => {
          //console.log('rebuilding graphs')
          this.data = []
          this.createInitialGraph()
        },
        error: (err) => {console.log('error',err)}
      }
    )

    this.realPointSubject?.subscribe(
      {
        next: (point) => {
          this.addRealPoint(point)
        },
        error: (err) => {console.log('error',err)}
      }
    )

   
  }

  createInitialSimulatedTrace(){
    this.simulatedTrace = 
      {
        x:[0],
        y:[0],
        z:[0],
        mode:"markers",
        marker: {
          size: 1,
          color: 'gray',
          symbol: 'circle-open',
          colorscale: 'Blues',
          sizemode: 'diameter',
          opacity: 0.8
        },
        type: 'scatter3d',
        name:'Simulated',
        showlegend: this.showLegend,
        width: 100
      }
  }

  createInitialRealTrace(){
    this.realTrace = 
      {
        x:[0],
        y:[0],
        z:[0],
        mode:"markers",
        marker: {
          size: 1,
          color: 'gray',
          symbol: 'circle',
          sizemode: 'diameter',
          opacity: 0.8
        },
        type: 'scatter3d',
        name:'Real',
        showlegend: this.showLegend
      }
  }
  createInitialGraph(){
    this.createInitialSimulatedTrace()
    this.createInitialRealTrace();

    this.data.push(this.simulatedTrace)
    this.data.push(this.realTrace)

    // Define Layout
    var layout = {
      //xaxis: {range: [40, 210], title: "Square Meters"},
      //yaxis: {range: [5, 20], title: "Price in Millions"}, 
      //zaxis: {range: [0, 20], title: "Months"}, 
      // title: "Simulated points x Real points",
      legend: {
        x: 0.0, 
        y: 1.2,
        yAnchor: 'bottom',
        with: 100,
      }
    };
    Plotly.newPlot("myPlot", this.data, layout);
  }

  addSimPoint(point:number[]){
    
    var robotName = this.mqttService.selectedRobot?.name
    if(robotName){
      var cinematicFunction = cinematicFunctions.get(robotName)
      if(cinematicFunction){
          var {x,y,z} = cinematicFunction(point);
          (this.simulatedTrace as {[key: string] : number[]})['x'].push(x);
          (this.simulatedTrace as {[key: string] : number[]})['y'].push(y);
          (this.simulatedTrace as {[key: string] : number[]})['z'].push(z);
          var size = (this.simulatedTrace as {[key: string] : any})['marker'].size
          if(size == 1){
            (this.simulatedTrace as {[key: string] : number[]})['x'].shift();
            (this.simulatedTrace as {[key: string] : number[]})['y'].shift();
            (this.simulatedTrace as {[key: string] : number[]})['z'].shift();
            (this.realTrace as {[key: string] : number[]})['x'].shift();
            (this.realTrace as {[key: string] : number[]})['y'].shift();
            (this.realTrace as {[key: string] : number[]})['z'].shift();
          }
      }
      var update = {
        'marker.size':8,
        'marker.opacity': 0.6,
        'marker.color':'blue'
      }
      var graphDiv = document.getElementById('myPlot');
        Plotly.restyle(graphDiv!, update,0)
      }
    
  }

  deleteSimPoint(index:number){
    
    var robotName = this.mqttService.selectedRobot?.name
    if(robotName){
      
      (this.simulatedTrace as {[key: string] : number[]})['x'].splice(index,1); 
      (this.simulatedTrace as {[key: string] : number[]})['y'].splice(index,1);
      (this.simulatedTrace as {[key: string] : number[]})['z'].splice(index,1);

      var update = {
        'marker.size':8,
        'marker.opacity': 0.6,
        'marker.color':'blue'
      }
      var graphDiv = document.getElementById('myPlot');
        Plotly.restyle(graphDiv!, update,0)
      }
    
  }

  addRealPoint(point:any){
    //console.log('add new real point', point)
    var robotName = this.mqttService.selectedRobot?.name
    if(robotName){
      var cinematicFunction = cinematicFunctions.get(robotName)
      if(cinematicFunction){
          var {x,y,z} = cinematicFunction(point);
          (this.realTrace as {[key: string] : number[]})['x'].push(x);
          (this.realTrace as {[key: string] : number[]})['y'].push(y);
          (this.realTrace as {[key: string] : number[]})['z'].push(z);
          
      }
      var update = {
        'marker.size':8,
        'marker.opacity': 0.6,
        'marker.color':'blue',
        'marker.symbol':'circle'
      }
      var graphDiv = document.getElementById('myPlot');
        Plotly.restyle(graphDiv!, update,1)
      }
  }
}
