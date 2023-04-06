import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { ARM_CANCELED_TRAJECTORY, ARM_CONNECTED, ARM_DISCONNECTED, ARM_HOME_SEARCHED, ARM_STATUS} from 'src/app/util/constants';
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
  searchingHome:boolean = false
  executingTrajectory:boolean = false

  timeoutTrajectory?:NodeJS.Timeout

  //@Output()
  //onSimulationPointsChanged:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onSimulationPointAdded:EventEmitter<any> = new EventEmitter<any>()

  @Output()
  onSimulationPointDeleted:EventEmitter<number> = new EventEmitter<number>()

  @Output()
  onSimulationPointListClear:EventEmitter<void> = new EventEmitter<void>()

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
    this.buildForm()
    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          this.selectedRobot = this.mqttService.selectedRobot
          this.buildForm()
          this.appliedPoints = []
          //this.onSimulationPointsChanged.emit(this.appliedPoints)    
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

  onFileChanged(event:any) {
      this.selectedFile = event.target.files[0];
      const fileReader = new FileReader();
      if(this.selectedFile){
        //////
        if(this.selectedFile.name.endsWith(".npy")){
          fileReader.readAsDataURL(this.selectedFile)
          
        }
        //////
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
                      this.appliedPoints.push(p)
                      this.onSimulationPointAdded.emit(p)
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
            } else if (this.selectedFile?.name.endsWith(".npy")){
              //format is npy
              console.log("file:", this.selectedFile.webkitRelativePath)
              var path = this.selectedFile.name
              
              //fileReader.readAsArrayBuffer(this.selectedFile)
              //this.loadFromNpy(fileReader.result as ArrayBuffer)
              //console.log("content",fileReader.result)
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
      this.onSimulationPointAdded.emit(row)
    })

    //this.graphService.buildGraph(this.appliedPoints)
    //this.onSimulationPointsChanged.emit(this.appliedPoints)
  }


  loadFromNpy(buf:ArrayBufferLike){
    
    //var dec = this.asciiDecode(buf.slice(0,6))
    //console.log("decode",dec)
    //console.log('buffer',buf)
    //var obj = loader.parse(buf);
    //console.log('parsed',obj)
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
    if(this.appliedPoints.length == 1){
      var p = {
        coordinates: this.appliedPoints[0]
      }
      this.mqttService.sendMoveToPointMessage(p);
    } else {
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
        //var simGraph = this.graphService.buildGraph(this.appliedPoints)
        //this.onSimulationPointsChanged.emit(this.appliedPoints)
        this.onSimulationPointAdded.emit(result)
      }
    });
  }

  
  
  ///load numpy
  asciiDecode(buf:any) {
    var array = new Uint8Array(buf);
    return String.fromCharCode.apply(null, (array as any) as number[]);
  }
  /*
  readUint16LE(buffer:ArrayBuffer) {
        var view = new DataView(buffer);
        var val = view.getUint8(0);
        val |= view.getUint8(1) << 8;
        return val;
  }

  fromArrayBuffer(buf:ArrayBuffer) {
    var offsetBytes = 0;
      // Check the magic number
    var magic = this.asciiDecode(buf.slice(0,6));
      if (magic.slice(1,6) != 'NUMPY') {
          throw new Error('unknown file type');
      }

      var version = new Uint8Array(buf.slice(6,8)),
          headerLength = this.readUint16LE(buf.slice(8,10)),
          headerStr = this.asciiDecode(buf.slice(10, 10+headerLength));
          offsetBytes = 10 + headerLength;
          //rest = buf.slice(10+headerLength);  XXX -- This makes a copy!!! https://www.khronos.org/registry/typedarray/specs/latest/#5

      // Hacky conversion of dict literal string to JS Object
      eval("var info = " + headerStr.toLowerCase().replace('(','[').replace('),',']'));
    
      // Intepret the bytes according to the specified dtype
      var data;
      if (info.descr === "|u1") {
          data = new Uint8Array(buf, offsetBytes);
      } else if (info.descr === "|i1") {
          data = new Int8Array(buf, offsetBytes);
      } else if (info.descr === "<u2") {
          data = new Uint16Array(buf, offsetBytes);
      } else if (info.descr === "<i2") {
          data = new Int16Array(buf, offsetBytes);
      } else if (info.descr === "<u4") {
          data = new Uint32Array(buf, offsetBytes);
      } else if (info.descr === "<i4") {
          data = new Int32Array(buf, offsetBytes);
      } else if (info.descr === "<f4") {
          data = new Float32Array(buf, offsetBytes);
      } else if (info.descr === "<f8") {
          data = new Float64Array(buf, offsetBytes);
      } else {
          throw new Error('unknown numeric dtype')
      }

      return {
          shape: info.shape,
          fortran_order: info.fortran_order,
          data: data
      };
    }
    */
}
