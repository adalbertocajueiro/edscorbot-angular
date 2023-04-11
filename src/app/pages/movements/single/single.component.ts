import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { JavaService } from 'src/app/services/java.service';
import { ARM_CANCELED_TRAJECTORY, ARM_CONNECTED, ARM_DISCONNECTED, ARM_HOME_SEARCHED, ARM_STATUS} from 'src/app/util/constants';
import { MetaInfoObject } from 'src/app/util/matainfo';
import { Point, Trajectory } from 'src/app/util/models';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit{
  
  form:FormGroup = new FormGroup({})
  numberOfJoints:number = 0
  //selectedTrajectory:any
  joints:string[] = []
  selectedFile?: File
  appliedPoints:any[] = []
  searchingHome:boolean = false
  executingTrajectory:boolean = false

  timeoutTrajectory?:NodeJS.Timeout

  trajectories:any[] = []

  @Output()
  onSimulationPointsChanged:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onSimulationPointAdded:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onSimulationPointDeleted:EventEmitter<number> = new EventEmitter<number>()

  @Output()
  onSimulationPointListClear:EventEmitter<void> = new EventEmitter<void>()

  @Output()
  onSendTrajectory:EventEmitter<void> = new EventEmitter<void>()


  selectedRobot?:MetaInfoObject
  connected:boolean = false

  @ViewChild("fileInput") fileInput?: any

  constructor(private formBuilder: FormBuilder, 
              private mqttService:EdscorbotMqttServiceService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private javaService:JavaService){
    
  }
  ngOnInit(): void {
    this.selectedRobot = this.mqttService.selectedRobot
    
    this.buildForm()
    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          this.selectedRobot = this.mqttService.selectedRobot
          this.buildForm()
          this.appliedPoints = []
          this.sortTrajectories()
        },
        error: (err) => { console.log('error',err)}
      }
    )

    this.mqttService.commandsSubject.subscribe(
      {
        next: (commandObj) => {
          
          if(commandObj.signal == ARM_STATUS
              || commandObj.signal == ARM_CONNECTED
              || commandObj.signal == ARM_DISCONNECTED
              || commandObj.signal == ARM_HOME_SEARCHED){

              this.selectedRobot = this.mqttService.selectedRobot
              if(this.mqttService.owner){
                this.connected = this.mqttService.owner?.id == this.mqttService.loggedUser?.id
              } else {
                this.connected = false
              }
              
              this.buildForm()

              if(commandObj.signal == ARM_CONNECTED){
                this.searchingHome = true
              }

              if(commandObj.signal == ARM_DISCONNECTED){
                //this.onSimulationPointsChanged.emit(this.appliedPoints)
              }

              if(commandObj.signal == ARM_HOME_SEARCHED){
                this.searchingHome = false
              }
          }

          if(commandObj.signal == ARM_CANCELED_TRAJECTORY){
            console.log('stopping trajectory execution')
            clearTimeout(this.timeoutTrajectory)
            this.executingTrajectory = false
          }
        },
        error: (err) => { console.log('error',err)}
      }
    )

    this.mqttService.movedSubject.subscribe(
      {
        next: (res) => {
          var errorState = res.errorState
          this.executingTrajectory = true
          clearTimeout(this.timeoutTrajectory)
          if(!errorState){
            this.timeoutTrajectory = this.createTimeout()
          } 
        },
        error: (err) => { console.log('error',err)}
      }
    )

    this.loadTrajectories()
  }

  loadTrajectories(){
    this.javaService.getTrajectories().subscribe(
      {
        next: (res:any) => {
          //console.log('trajectories',res)
          this.trajectories = res
          this.sortTrajectories()
        },
        error: (err) => {console.log('error',err)}
      }
    )
  }

  sortTrajectories(){
    if(this.selectedRobot){
      this.trajectories = this.trajectories.sort( (t1:any,t2:any) => {
        if(this.compatible(t1)){
          if(this.compatible(t2)){
            return 0
          } else{
            return -1
          }
        }else {
          if(this.compatible(t2)){
            return 1
          } else {
            return 0
          }
        }
        
      } )
    }
  }

  sortTrajectoriesByUsername(){
    if(this.selectedRobot){
      this.trajectories = this.trajectories.sort( (t1:any,t2:any) => {
        if(this.compatible(t1)){
          if(this.compatible(t2)){
            return t1.owner.username.localeCompare(t2.owner.username)
          } else{
            return -1
          }
        }else {
          if(this.compatible(t2)){
            return 1
          } else {
            return t1.owner.username.localeCompare(t2.owner.username)
          }
        }
        
      } )
    }else{
      this.trajectories = this.trajectories.sort( (t1:any,t2:any) => {
        return t1.owner.username.localeCompare(t2.owner.username)
      })
    }
  }

  sortTrajectoriesByDate(){
    if(this.selectedRobot){
      this.trajectories = this.trajectories.sort( (t1:any,t2:any) => {
        if(this.compatible(t1)){
          if(this.compatible(t2)){
            return t1.timestamp - t2.timestamp
          } else{
            return -1
          }
        }else {
          if(this.compatible(t2)){
            return 1
          } else {
            return t1.timestamp - t2.timestamp
          }
        }
        
      } )
    }else{
      this.trajectories = this.trajectories.sort( (t1:any,t2:any) => {
        return t1.timestamp - t2.timestamp
      })
    }
  }
  compatible(trajectory:any){
    return this.selectedRobot?.joints.length == trajectory.points[0].coordinates.length - 1
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
      var control = new FormControl('',[Validators.required, Validators.pattern('[-]?[0-9]*[.]?[0-9]*'), 
                Validators.min(Math.min(this.selectedRobot!.joints[index].minimum,this.selectedRobot!.joints[index].maximum)),
                Validators.max(Math.max(this.selectedRobot!.joints[index].minimum,this.selectedRobot!.joints[index].maximum))])  
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

  createTimeout(){
    var timer = setTimeout(() => {
      this.executingTrajectory = false
    },2000)

    return timer
  }
  
  deletePoint(index:number){
    this.appliedPoints.splice(index,1)
    //this.graphService.buildGraph(this.appliedPoints)
    //this.onSimulationPointsChanged.emit(this.appliedPoints)
    this.onSimulationPointDeleted.emit(index)
  }

  clearPointList(){
    //console.log('clear list')
    this.appliedPoints = []
    //this.onSimulationPointsChanged.emit(this.appliedPoints)
    this.onSimulationPointListClear.emit()
  }

  selectTrajectory(trajectory:any){
    this.appliedPoints = trajectory.points
    //this.onSimulationPointsChanged.emit(this.appliedPoints)
  }

  useTrajectory(trajectory:any){
    //this.appliedPoints = [...trajectory.points]
    this.appliedPoints = []
    trajectory.points.forEach( (p:any) =>  {
      this.appliedPoints.push(p)
      this.onSimulationPointAdded.emit(p)
    })
  }

  addTrajectoryPoints(trajectory:any){
   trajectory.points.forEach( (p:any) =>  {
      this.appliedPoints.push(p)
      this.onSimulationPointAdded.emit(p)
    })
  }

  onFileChanged(event:any) {
      this.selectedFile = event.target.files[0];
      const fileReader = new FileReader();
      if(this.selectedFile){
        
        fileReader.readAsText(this.selectedFile, "UTF-8");
        
        fileReader.onload = () => {
          console.log('file result',this.selectedFile)
          if(fileReader.result){
            var points:any[][] = []
            if(this.selectedFile?.name.endsWith(".json")){
              points = JSON.parse(fileReader.result.toString())
              if(points.length > 0){
                if (this.mqttService.selectedRobot?.joints.length == points[0].length){
                    //points have not time coordinate. using the default
                    
                    points.map( p => p.push(this.mqttService.defaultPointTime))
                    points.forEach( p =>  {
                      var point = {
                        coordinates: p
                      }
                      this.appliedPoints.push(point)
                      this.onSimulationPointAdded.emit(point)
                    })
                } else {
                  this.snackBar.open("File specifies an incompatible number of points for this arm","Close",{duration:5000,verticalPosition:"top"})
                }
              } else{
                  //file has no points
                  this.snackBar.open("File does not define points","Close",{duration:5000,verticalPosition:"top"})
              }
              
            } else if (this.selectedFile?.name.endsWith(".tsv")){
              //console.log('trying to load as csv')
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
      var point = {
        coordinates:row
      }  
      this.appliedPoints.push(point)
      this.onSimulationPointAdded.emit(point)
    })

    //this.graphService.buildGraph(this.appliedPoints)
    //this.onSimulationPointsChanged.emit(this.appliedPoints)
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
    this.onSendTrajectory.emit()
    if(this.appliedPoints.length == 1){
      //var p = {
      //  coordinates: this.appliedPoints[0]
      //}
      this.mqttService.sendMoveToPointMessage(this.appliedPoints[0]);
    } else {
      var trajectory:Trajectory = {
        points: []
      }
      this.appliedPoints.forEach ( p => {
        //var point:Point = {
        //  coordinates: p
        //}
        trajectory.points.push(p)
      })
      this.mqttService.sendTrajectoryMessage(trajectory)
      this.executingTrajectory = true
      this.timeoutTrajectory = this.createTimeout()
    }
    
  }

  sendCancelTrajectory(){
    console.log('cancelling trajectory')
    this.mqttService.sendCancelTrajectoryMessage()
    this.executingTrajectory = false
    clearTimeout(this.timeoutTrajectory)
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
        this.onSimulationPointAdded.emit(result)
      }
    });
  }

  
  
  ///load numpy
  asciiDecode(buf:any) {
    var array = new Uint8Array(buf);
    return String.fromCharCode.apply(null, (array as any) as number[]);
  }
  
  saveTrajectory(){
    var trajectory:any = {
      points:this.appliedPoints
    }

    this.javaService.saveTrajectory(trajectory).subscribe(
      {
        next: (res) => {
          //console.log('save trajectory',res)
          this.loadTrajectories()
        },
        error: (err) => {console.log('error',err)}
      }
    )
  }

  deleteTrajectory(trajectory:any){
    
    this.javaService.deleteTrajectory(trajectory).subscribe(
      {
        next: (res) => {
          //console.log('deleted trajectory',res)
          this.loadTrajectories()
        },
        error: (err) => {console.log('error',err)}
      }
    )
  }

  drop(event: any) {
    moveItemInArray(this.appliedPoints, event.previousIndex, event.currentIndex);
    this.onSimulationPointsChanged.emit(this.appliedPoints)
  }
  
}
