import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { ARM_CANCELED_TRAJECTORY, ARM_CONNECTED, ARM_DISCONNECTED, ARM_STATUS} from 'src/app/util/constants';
import { MetaInfoObject } from 'src/app/util/matainfo';
import { Point, Trajectory } from 'src/app/util/models';

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

  simulationGraph:any
  realGraph:any

  @Output()
  onSimulationPointsChanged:EventEmitter<any> = new EventEmitter<any>()

  selectedRobot?:MetaInfoObject
  connected:boolean = false

  @ViewChild("fileInput") fileInput?: any

  constructor(private formBuilder: FormBuilder, 
              private mqttService:EdscorbotMqttServiceService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog){
    
  }
  ngOnInit(): void {
    this.selectedRobot = this.mqttService.selectedRobot
    this.connected = this.mqttService.connected
    this.buildForm()
    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          this.selectedRobot = this.mqttService.selectedRobot
          this.buildForm()
          this.appliedPoints = []
          this.onSimulationPointsChanged.emit(this.appliedPoints)    
        },
        error: (err) => { console.log('error',err)}
      }
    )

    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          
          if(commandObj.signal == ARM_STATUS
              || commandObj.signal == ARM_CONNECTED
              || commandObj.signal == ARM_DISCONNECTED){

              this.selectedRobot = this.mqttService.selectedRobot
              this.connected = this.mqttService.connected
              this.buildForm()
              if(commandObj.signal == ARM_DISCONNECTED){
                this.appliedPoints = []
                this.onSimulationPointsChanged.emit(this.appliedPoints)
              }
          }

          if(commandObj.signal == ARM_CANCELED_TRAJECTORY){
            console.log('stopping trajectory execution')
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )
  }

  public buildForm() {
    if(this.selectedRobot){
      this.numberOfJoints = this.selectedRobot.joints.length
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
      var control = new FormControl('',[Validators.required, Validators.pattern('[-]?[0-9]*'), Validators.min(this.selectedRobot!.joints[index].minimum),Validators.max(this.selectedRobot!.joints[index].maximum)])  
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

  /*
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
  */
  deletePoint(point:any[]){
    this.appliedPoints = this.appliedPoints.filter (p => p != point)
    //this.graphService.buildGraph(this.appliedPoints)
    this.onSimulationPointsChanged.emit(this.appliedPoints)
  }

  clearPointList(){
    this.appliedPoints = []
    //this.graphService.buildGraph(this.appliedPoints)
    this.onSimulationPointsChanged.emit(this.appliedPoints)
  }

  selectTrajectory(trajectory:any){
    this.appliedPoints = trajectory.points
    //this.graphService.buildGraph(this.appliedPoints)
    this.onSimulationPointsChanged.emit(this.appliedPoints)
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
                    //this.graphService.buildGraph(this.appliedPoints)
                    this.onSimulationPointsChanged.emit(this.appliedPoints)
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

    //this.graphService.buildGraph(this.appliedPoints)
    this.onSimulationPointsChanged.emit(this.appliedPoints)
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

  sendTrajectoryToArm(){
    
    var trajectory:Trajectory = {
      points: []
    }
    this.appliedPoints.forEach ( p => {
      var point:Point = {
        coordinates: p
      }
      trajectory.points.push(point)
    })
    this.mqttService.sendTrajectoryMessage(trajectory)
  }

  openPointDialog() {
    const dialogRef = this.dialog.open(DialogComponent, 
      {
        data: {
          form: this.form,
          joints: this.joints,
          selectedRobot:this.selectedRobot
        },
      })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.appliedPoints.push(result)
        //var simGraph = this.graphService.buildGraph(this.appliedPoints)
        this.onSimulationPointsChanged.emit(this.appliedPoints)
      }
    });
  }
}
