import { Component } from '@angular/core';

@Component({
  selector: 'app-trajectories',
  templateUrl: './trajectories.component.html',
  styleUrls: ['./trajectories.component.scss']
})
export class TrajectoriesComponent {

  toogleButtonsChanged(event:any){
    console.log(event)
  }
}
