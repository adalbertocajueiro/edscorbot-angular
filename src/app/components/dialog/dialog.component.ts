import { Component, Inject} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetaInfoObject } from 'src/app/util/matainfo';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent{

  form:FormGroup = new FormGroup({})
  joints:string[] = []
  selectedRobot?:MetaInfoObject
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = data.form
    this.joints = data.joints
    this.selectedRobot = data.selectedRobot
  }

  getRangeForJoint(field:string):string{
    var jointNumber = parseInt(field.replaceAll("J",'')) - 1
    
    if(!Number.isNaN(jointNumber)){
      var minValue = this.selectedRobot!.joints[jointNumber].minimum
      var maxValue = this.selectedRobot!.joints[jointNumber].maximum

      return 'Min: ' + minValue + ' Max: ' + maxValue
    } else {
      return ''
    }
  }

  clear(){
    this.form.reset()
  }

  checkCoordinate(field:string){
    var control = this.form.controls[field]
    if(!control.valid){
      control.setValue('')
    }
  }

  buildPoint(){
    if(this.form.valid){
      var point:number[] = []
      
      
      Object.entries(this.form.controls).forEach (
        entry => {
          var value = parseFloat(entry[1].value)
          point.push(value)
        }
      )
      var returnedPoint = {
        coordinates:point
      }
      return returnedPoint
    } else {
      return undefined
    }
  }
}
