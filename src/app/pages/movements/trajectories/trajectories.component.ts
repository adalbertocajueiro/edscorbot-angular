import { Component, OnInit } from '@angular/core';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-trajectories',
  templateUrl: './trajectories.component.html',
  styleUrls: ['./trajectories.component.scss']
})
export class TrajectoriesComponent {

  selectedFile?: File
  selectedTrajectory:any
  numberOfJoints?:number = 0
  joints:string[] = []

  constructor(private graphService:GraphService){
    
  }

  toogleButtonsChanged(event:any){
    console.log(event)
  }

  

  onFileChanged(event:any) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    if(this.selectedFile){
      fileReader.readAsText(this.selectedFile, "UTF-8");
      
      fileReader.onload = () => {
        if(fileReader.result){
          var points = JSON.parse(fileReader.result.toString())
          var newTrajectory:any = {}
          newTrajectory.points = points
          this.showPoints(newTrajectory)
          console.log(this.selectedTrajectory);
        }
        
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
      
    }
    
  }

  showPoints(event:any){
    this.selectedTrajectory = event
    this.numberOfJoints = this.selectedTrajectory.points[0].length
    this.joints = []
    var jointName = "J"
    if(this.numberOfJoints){
      for (let index = 0; index < this.numberOfJoints; index++) {
        this.joints.push(jointName + (index + 1).toString())
      }
      this.joints.push('Time (ms)')
    }
    
    this.graphService.buildPoints(this.selectedTrajectory.points)
  }

}
