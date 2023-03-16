import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetaInfoObject } from 'src/app/util/matainfo';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent {

  selectedRobot?:MetaInfoObject

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedRobot = data.selectedRobot
  }
}
