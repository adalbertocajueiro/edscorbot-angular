import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { robotPointTo3D } from 'src/app/util/util';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit{
  
  form:FormGroup = new FormGroup({})
  numberOfJoints:number = 0
  joints:string[] = []
  mqttServ?:EdscorbotMqttServiceService

  constructor(private formBuilder: FormBuilder, private mqttService:EdscorbotMqttServiceService){
    this.mqttServ = this.mqttService
  }
  ngOnInit(): void {
    this.buildForm()
  }

  public buildForm() {
    if(this.mqttService.selectedRobot){
      this.numberOfJoints = this.mqttService.selectedRobot?.joints.length
      this.form = this.formBuilder.group(
        this.mountControls(this.numberOfJoints)
      );
    }
  }

  mountControls(amount:number){
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
      console.log(point);
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
}
