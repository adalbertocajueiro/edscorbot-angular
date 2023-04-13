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
  fileContent:any

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
      const fileReader = new FileReader();
      console.log('selected file',this.selectedFile)
      var formData:FormData = new FormData()
      formData.set('sourceType',this.sourceType! + "")
      formData.set('targetType',this.targetType! + "")
      formData.set('file', this.selectedFile)
      formData.set('hasTimeInfo', 'false')
      this.pythonService.convertFile(formData).subscribe(
         (res) => {
          console.log('returned content',res)
          //the returned content is an array of points
          this.fileContent = res
          //the source and target formats can be suggested besed on the file content
         }
       
      )
      
  }

  exportToTsv(){
    const data = this.generateTsv()
    const blob = new Blob([data], {
              type: 'application/octet-stream'
          });
          //const blob = new Blob(data, { type: "octet/stream"});
          //new Blob(data, { type: "octet/stream"});
          const a = document.createElement('a')
          //this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
          this.fileUrl = window.URL.createObjectURL(blob);
          a.href = this.fileUrl
          a.download = "temp" + '.tsv';
          a.click();
          URL.revokeObjectURL(this.fileUrl);
  }
  generateTsv(){
    var tsvContent = (this.fileContent as any[])
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
    const data = JSON.stringify(this.fileContent);
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
      )
  }

}
