import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonService } from 'src/app/services/python.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent {

  selectedFile:any
  sourceType?:number = 2
  targetType?:number = 1

  fileUrl:any

  constructor(private pythonService:PythonService, private sanitizer: DomSanitizer){}
  
  changeSourceType(event:any){
    var option = this.getSelectedOption(event.target.options)
    console.log('source', option?.value)
    this.sourceType = parseInt(option?.value!)
  }

  getSelectedOption(options:HTMLOptionsCollection){
    return options.item(options.selectedIndex)
  }

  changeTargetType(event:any){
    var option = this.getSelectedOption(event.target.options)
    console.log('target', this.getSelectedOption(event.target.options)?.value)
    this.targetType = parseInt(option?.value!)
  }

  onFileChanged(event:any) {
      this.selectedFile = event.target.files[0];
      
      console.log('selected file',this.selectedFile)
      /*
      if(selectedFile){ 
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
      */
  }

  submit(){
      console.log('src,tgt,file',this.sourceType,this.targetType,this.selectedFile)
      var formData:FormData = new FormData()
      formData.set('sourceType',this.sourceType! + "")
      formData.set('targetType',this.targetType! + "")
      formData.set('file', this.selectedFile)

      this.pythonService.convertFile(formData).subscribe(
         (res) => {
          console.log(res)
          const data = JSON.stringify(res);
          const blob = new Blob([data], {
              type: 'application/octet-stream'
          });
          //const blob = new Blob(data, { type: "octet/stream"});
          //new Blob(data, { type: "octet/stream"});
          const a = document.createElement('a')
          //this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
          this.fileUrl = window.URL.createObjectURL(blob);
          a.href = this.fileUrl
          a.download = "temp" + '.txt';
          a.click();
          URL.revokeObjectURL(this.fileUrl);
         }
        /*(blob:any) => {
            const a = document.createElement('a')
            const objectUrl = URL.createObjectURL(blob)
            a.href = objectUrl
            a.download = "temp" + '.xlsx';
            a.click();
            URL.revokeObjectURL(objectUrl);
          }
          */
        
      )
  }
}
