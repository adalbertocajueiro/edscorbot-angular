import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent {

  @Input()
  tooltip:string = ''

  @Input()
  checked:boolean = false

  @Input()
  width:string = "60px"

  @Input()
  height:string = "34px"

  @Output()
  onToggleChanged:EventEmitter<boolean> = new EventEmitter<boolean>()

  toggleChanged(event:any){
    this.onToggleChanged.emit(event)
  }
}
