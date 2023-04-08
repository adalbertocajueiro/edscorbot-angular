import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss']
})
export class LogoutDialogComponent {

  autherror:boolean = false

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.autherror = data.autherror
  }
}
