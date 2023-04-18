import { Component } from '@angular/core';
import { EdscorbotMqttServiceService } from 'src/app/services/edscorbot-mqtt-service.service';
import { PythonService } from 'src/app/services/python.service';
import { MetaInfoObject } from 'src/app/util/matainfo';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent {

  selectedFile:any
  sourceType?:number = 2
  targetType?:number = 1
  hasTimeInfo:boolean = false

  fileUrl:any
  originalFileContent?:any[]
  convertedFileContent?:any[]

  selectedRobot?:MetaInfoObject

  constructor(private pythonService:PythonService, private mqttService:EdscorbotMqttServiceService){
    this.mqttService.selectedRobotSubject.subscribe(
      {
        next: (res) => {
          this.selectedRobot = this.mqttService.selectedRobot
        }
      }
    )
  }
  
  changeSourceType(event:any){
    var option = this.getSelectedOption(event.target.options)
    this.sourceType = parseInt(option?.value!)
  }

  getSelectedOption(options:HTMLOptionsCollection){
    return options.item(options.selectedIndex)
  }

  changeTargetType(event:any){
    var option = this.getSelectedOption(event.target.options)
    this.targetType = parseInt(option?.value!)
  }

  onFileChanged(event:any) {
      this.selectedFile = event.target.files[0];
      var formData:FormData = new FormData()
      formData.set('file', this.selectedFile)

      this.pythonService.loadFile(formData).subscribe(
        {
          next: (res:any) => {
            this.originalFileContent = res.content
          },
          error: (err) => {
            console.log('error', err)
          }
        } 
      )
  }

  convert(){
    var formData:FormData = new FormData()
    formData.set('sourceType',this.sourceType! + "")
    formData.set('targetType',this.targetType! + "")
    formData.set('content', JSON.stringify(this.originalFileContent))
    formData.set('hasTimeInfo', this.hasTimeInfo + '')
    formData.set('robotName', this.selectedRobot?.name!)
    
    this.pythonService.convertFile(formData).subscribe(
        {
          next: (res:any) => {
            this.convertedFileContent = res.content
          },
          error: (err) => {
            console.log('error', err)
          }
        } 
      )
      
  }

  exportToTsv(){
    const data = this.generateTsv()
    const blob = new Blob([data], {
      type: 'application/octet-stream'
    });
    const a = document.createElement('a')
    this.fileUrl = window.URL.createObjectURL(blob);
    a.href = this.fileUrl
    a.download = "temp" + '.tsv';
    a.click();
    URL.revokeObjectURL(this.fileUrl);
  }
  generateTsv(){
    var tsvContent = (this.originalFileContent as any[])
    var result = new Array()
    var firstPoint:any[] = tsvContent[0]
    firstPoint.forEach((coord,index) => {
        result.push("J" + (index+1))
        if(index < firstPoint.length - 1){
          result.push("\t")
        } else {
          result.push("\n")
        }
    })
    tsvContent.forEach((point:any[]) => {
      point.forEach((coord,index) => {
        result.push(coord)
        if(index < point.length - 1){
          result.push("\t")
        } else {
          result.push("\n")
        }
      })
    });

    return result.join("")
  }
  exportToJson(){
    const data = JSON.stringify(this.originalFileContent);
    const blob = new Blob([data], {
      type: 'application/octet-stream'
    });

    const a = document.createElement('a')
    this.fileUrl = window.URL.createObjectURL(blob);
    a.href = this.fileUrl
    a.download = "temp" + '.json';
    a.click();
    URL.revokeObjectURL(this.fileUrl);
  }
  submit(){
      console.log('src,tgt,file',this.sourceType,this.targetType,this.selectedFile)
      var formData:FormData = new FormData()
      formData.set('sourceType',this.sourceType! + "")
      formData.set('targetType',this.targetType! + "")
      formData.set('file', this.selectedFile)
      formData.set('hasTimeInfo', 'false')

      this.pythonService.convertFile(formData).subscribe(
         (res) => {
          console.log('returned content',res)
          const data = JSON.stringify(res);
          const blob = new Blob([data], {
              type: 'application/octet-stream'
          });
          const a = document.createElement('a')
          this.fileUrl = window.URL.createObjectURL(blob);
          a.href = this.fileUrl
          a.download = "temp" + '.txt';
          a.click();
          URL.revokeObjectURL(this.fileUrl);
         }
      )
  }

   changeEnabled(event:any){
    this.hasTimeInfo = event.target.checked
  }

}
