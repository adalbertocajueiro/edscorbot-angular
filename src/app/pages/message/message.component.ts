import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  blur: boolean = true
  type:'error' | 'warning_amber' | 'check' | undefined
  message?:string
  redirecturi?:string

  ///TODO: put the text of the button as well

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute) {
    this.message = this.activatedRoute.snapshot.queryParams['message']
    this.type = this.activatedRoute.snapshot.queryParams['type']
    this.redirecturi = this.activatedRoute.snapshot.queryParams['redirecturi']
    console.log('parameters',this)
  }

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        message: this.message,
        type: this.type
        // TODO: pass the text of button as well
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.blur = false
      if(this.redirecturi){
        window.location.href = window.location.origin + this.redirecturi
      }
    });
  }
}
