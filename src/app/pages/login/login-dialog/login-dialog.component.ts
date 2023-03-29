import { AfterViewInit, Component, DoCheck, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent{
  
  form:FormGroup = new FormGroup({})
  username?:string
  password?:string
  passVisible:boolean = false

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.form = data.form
  }

  resetForm(){
    this.username = undefined
    this.password = undefined
    this.sendCredentials()
  }
  sendCredentials(){
    var obj = {
      username: this.form.controls['username'],
      password: this.form.controls['password']
    }

    return obj
  }

  toggleVisibility(){
    this.passVisible = !this.passVisible
  }
}
