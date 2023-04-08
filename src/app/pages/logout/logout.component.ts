import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  blur:boolean = true
  auterror:boolean = false

  constructor(private dialog:MatDialog, private activatedRoute:ActivatedRoute){
    var msg = this.activatedRoute.snapshot.queryParams['msg']
    //console.log(msg)
    this.auterror = msg != undefined
  }

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent,{
        data: {
          autherror: this.auterror
        }
      })
    dialogRef.afterClosed().subscribe(result => {
      this.blur = false
      window.location.href = window.location.origin + '/login'
    });
  }
}
