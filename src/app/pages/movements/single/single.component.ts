import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { GraphService } from 'src/app/services/graph.service';
import { ARM_GET_METAINFO, META_INFO_CHANNEL } from 'src/app/util/constants';

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
  appliedPoints:number[][] = []
  mqttServ?:EdscorbotMqttServiceService

  constructor(private formBuilder: FormBuilder, 
              private mqttService:EdscorbotMqttServiceService,
              private graphService:GraphService){
    this.mqttServ = this.mqttService
  }
  ngOnInit(): void {
    if(this.mqttService.selectedRobot == undefined){
      const content = {
        signal: ARM_GET_METAINFO
      }
      const publish = {
        topic: META_INFO_CHANNEL,
        qos: 0,
        payload: JSON.stringify(content)
      }
      this.mqttService.client.unsafePublish(publish.topic,publish.payload,publish.qos)
    } 
    this.buildForm()
  }

  public buildForm() {
    if(this.mqttService.selectedRobot){
      this.numberOfJoints = this.mqttService.selectedRobot?.joints.length
      this.form = this.formBuilder.group(
        this.mountControls()
      );
    }
  }

  mountControls(){
    var obj:any = {}
    var jointName = "J"
    for (let index = 0; index < this.numberOfJoints; index++) {
      var control = new FormControl('',[Validators.required, Validators.pattern('[0-9]*')])  
      obj[jointName + (index + 1).toString()] = control
      this.joints.push(jointName + (index + 1).toString())
    }
    var control = new FormControl(this.mqttService.defaultPointTime + '',Validators.required)  
    obj['Time (ms)'] = control
    this.joints.push('Time (ms)')

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
      console.log(this.appliedPoints)
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
}
