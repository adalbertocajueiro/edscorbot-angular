import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  blur:boolean = true

  constructor(private dialog:MatDialog){

  }

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent)
    dialogRef.afterClosed().subscribe(result => {
      this.blur = false
      
      window.location.href = window.location.origin + '/login'
    });
  }
}
