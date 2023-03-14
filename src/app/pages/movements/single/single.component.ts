import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { GraphService } from 'src/app/services/graph.service';
import { ARM_CONNECTED, ARM_DISCONNECTED, ARM_GET_METAINFO, ARM_METAINFO, ARM_STATUS, META_INFO_CHANNEL } from 'src/app/util/constants';
import { MetaInfoObject } from 'src/app/util/matainfo';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit{
  
  form:FormGroup = new FormGroup({})
  numberOfJoints:number = 0
  selectedTrajectory:any
  joints:string[] = []
  selectedFile?: File
  appliedPoints:number[][] = []
  mqttServ?:EdscorbotMqttServiceService

  selectedRobot?:MetaInfoObject

  @ViewChild("fileInput") fileInput?: any

  constructor(private formBuilder: FormBuilder, 
              private mqttService:EdscorbotMqttServiceService,
              private graphService:GraphService,
              private snackBar: MatSnackBar){
    this.mqttServ = this.mqttService
  }
  ngOnInit(): void {
    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          
          if(commandObj.signal == ARM_STATUS
              || commandObj.signal == ARM_CONNECTED
              || commandObj.signal == ARM_DISCONNECTED){

              this.selectedRobot = this.mqttService.selectedRobot
              this.buildForm()
              if(commandObj.signal == ARM_DISCONNECTED){
                this.appliedPoints = []
                this.graphService.buildPoints(this.appliedPoints)
              }
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )
  }

  public buildForm() {
    if(this.mqttService.selectedRobot){
      this.numberOfJoints = this.mqttService.selectedRobot?.joints.length
      
    } else {
      this.numberOfJoints = 0
    }
    this.form = this.formBuilder.group(
        this.mountControls()
    );
  }

  mountControls(){
    this.joints = []
    var obj:any = {}
    var jointName = "J"
    for (let index = 0; index < this.numberOfJoints; index++) {
      var control = new FormControl('',[Validators.required, Validators.pattern('[0-9]*')])  
      obj[jointName + (index + 1).toString()] = control
      this.joints.push(jointName + (index + 1).toString())
    }
    if(this.numberOfJoints > 0){
      var control = new FormControl(this.mqttService.defaultPointTime + '',Validators.required)  
      obj['Time (ms)'] = control
      this.joints.push('Time (ms)')
    }

    return obj
  }

  clear(){
    this.form.reset()
  }

  jointChanged(event:any){
    var point = this.convertFormToArray()
  }

  robotSelected(event:any){
    this.mqttService.selectRobotByName(event.value)
    this.buildForm()
  }

  moveToPoint(){
    var point:number[] = []
   
    var hasInvalidValue:boolean = 
      Object.entries(this.form.controls)
        .map (entry => parseInt(entry[1].value))
        .some( v => Number.isNaN(v))
    if(hasInvalidValue){
      // it has invalid value and cannot send to robot
      console.log('invalid point');
    } else {
      var point = this.convertFormToArray()
      this.appliedPoints.push(point)
      this.graphService.buildPoints(this.appliedPoints)
    }
    
  }
  convertFormToArray(){
    var point:number[] = []
   
    Object.entries(this.form.controls).forEach (
      entry => {
        var value = parseInt(entry[1].value)
        if(entry[1].value != ''){  
          if(Number.isNaN(value)){
            entry[1].setValue('')
          }
        }
        point.push(value)
      }
    )
    return point
  }

  deletePoint(point:any[]){
    this.appliedPoints = this.appliedPoints.filter (p => p != point)
    this.graphService.buildPoints(this.appliedPoints)
  }

  clearPointList(){
    this.appliedPoints = []
    this.graphService.buildPoints(this.appliedPoints)
  }

  selectTrajectory(trajectory:any){
    this.appliedPoints = trajectory.points
    this.graphService.buildPoints(this.appliedPoints)
  }

  onFileChanged(event:any) {
      this.selectedFile = event.target.files[0];
      const fileReader = new FileReader();
      if(this.selectedFile){
        fileReader.readAsText(this.selectedFile, "UTF-8");
        
        fileReader.onload = () => {
          if(fileReader.result){
            var points:any[][] = []
            try{
                points = JSON.parse(fileReader.result.toString())
                if(points.length > 0){
                  
                  if (this.mqttService.selectedRobot?.joints.length == points[0].length){
                    //points have not time coordinate. using the default
                    
                    points.map( p => p.push(this.mqttService.defaultPointTime))
                    points.forEach( p =>  this.appliedPoints.push(p))
                    this.graphService.buildPoints(this.appliedPoints)
                  } else {
                    this.snackBar.open("File specifies an incompatible number of points for this arm","Close",{duration:5000,verticalPosition:"top"})
                  }
                } else{
                    //file has no points
                    this.snackBar.open("File does not define points","Close",{duration:5000,verticalPosition:"top"})
                }
            } catch(err){ //try to load as csv
              console.log('trying to load as csv')
              this.loadFromCsv(fileReader.result)
            }
          }
          
        }
        fileReader.onerror = (error) => {
          console.log(error);
        } 
      }
  }

  loadFromCsv(csvContent:string | ArrayBuffer){

    var lines = csvContent.toString().split('\r')
    lines.shift()
    lines.forEach( l => {
      var row = l.replaceAll('\n','')
                  .trim()
                  .split('\t')
                  .map ( n => n.replaceAll(',','.'))
                  .map ( n => parseFloat(n))
      this.appliedPoints.push(row)
    })

    this.graphService.buildPoints(this.appliedPoints)
  }

  verifyConditions(event:any){
    if(!this.mqttService.selectedRobot){
      this.snackBar.open("Robot is not selected", "Close",{duration:5000,verticalPosition:"top"})
      return false
    } else {
      return true
    }
  }
  nothing(){ }
}
