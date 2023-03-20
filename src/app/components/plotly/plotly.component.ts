import { Component, DoCheck, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min'
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss']
})
export class PlotlyComponent implements OnInit{
  
  graph3d?:any

  data:Plotly.Data[] = []

  constructor(private graphService:GraphService){
    this.graph3d = this.graphService.buildGraph([])
  }
  ngOnInit(): void {
    var xArray:number[] = [0];
    var yArray:number[] = [0];
    var zArray:number[] = [0];

    // Define Data
    this.data = [ 
      {
        x:xArray,
        y:yArray,
        z:zArray,
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
        showlegend: true
      }
    ];

    // Define Layout
    var layout = {
      //xaxis: {range: [40, 210], title: "Square Meters"},
      //yaxis: {range: [5, 20], title: "Price in Millions"}, 
      //zaxis: {range: [0, 20], title: "Months"}, 
      title: "Simulated points x Real points"
    };

    Plotly.newPlot("myPlot", this.data, layout);
  }
  
  create(){
    var xArray = [50,60,70,80,90,100,110,120,130,140,150];
    var yArray = [7,8,8,9,9,9,10,11,14,14,15];
    var zArray = [3,3,3,3,3,3, 3, 3, 3, 3, 3];

    xArray.forEach( x => {
      (this.data[0] as {[key: string] : number[]})['x'].push(x);
    }); 
    (this.data[0] as {[key: string] : number[]})['x'].shift()
    
    yArray.forEach( y => {
      (this.data[0] as {[key: string] : number[]})['y'].push(y);
    }); 
    (this.data[0] as {[key: string] : number[]})['y'].shift()

    zArray.forEach( z => {
      (this.data[0] as {[key: string] : number[]})['z'].push(z);
    }); 
    (this.data[0] as {[key: string] : number[]})['z'].shift()

    var update = {
        'marker.size':8,
            'marker.opacity': 0.6,
            'marker.color':'blue'
    };
    var graphDiv = document.getElementById('myPlot');
    Plotly.restyle(graphDiv!, update,0)
    
  }

  addPoint(){
    var graphDiv = document.getElementById('myPlot');
    
    //(this.data[0] as {[key: string] : number[]})['x'].push(200);
    //(this.data[0] as {[key: string] : number[]})['y'].push(20);
    //(this.data[0] as {[key: string] : number[]})['z'].push(10);
    

    var xArray = [50,60,70,80,90,100,110];
    var yArray = [7,8,8,9,9,9,10];
    var zArray = [3,3,3,3,3,3, 3];

    var trace2:Plotly.Data = 
    {
        x:xArray,
        y:yArray,
        z:zArray,
        mode:"markers",
        marker: {
                    size: 8,
                    color: [127,127,127,127,127,127,127],
                    symbol: 'circle',
                    colorscale: 'Blues',
                    sizemode: 'diameter',
                    
                    opacity: 0.8
                    
        },
        type: 'scatter3d',
        name:'Real',
        showlegend: true
      }
      this.data.push(trace2)
        var update = {
            'marker.opacity': 0.7
        };
        Plotly.restyle(graphDiv!, update,0)
    }
}
