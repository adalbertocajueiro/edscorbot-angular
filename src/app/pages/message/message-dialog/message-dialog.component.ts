import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent {

  type: 'error' | 'warning_amber' | 'check'
  message?: string

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message
    this.type = data.type
  }
}
