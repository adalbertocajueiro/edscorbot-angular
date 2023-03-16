import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toogle-button',
  templateUrl: './toogle-button.component.html',
  styleUrls: ['./toogle-button.component.scss']
})
export class ToogleButtonComponent {
  label: 'Simulated' | 'Executed' = 'Simulated'

  @Output()
  onToggleChanged:EventEmitter<boolean> = new EventEmitter<boolean>()

  toggleChanged(event:any){
    this.label = event.target.checked? 'Executed' : 'Simulated'
    this.onToggleChanged.emit(event.target.checked)
  }
}
