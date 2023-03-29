import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JavaService } from 'src/app/services/java.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  form:FormGroup = new FormGroup({})
  blur:boolean = true

  constructor(private javaService:JavaService, private dialog:MatDialog,private formBuilder: FormBuilder){

  }
  ngOnInit(): void {
    this.buildForm()
    this.openDialog()
  }

  public buildForm() {
    var controlUsername = new FormControl('') 
    var controlPassword = new FormControl('')  

    var obj: any = {}
    obj['username'] = controlUsername
    obj['password'] = controlPassword

    this.form = this.formBuilder.group(
        obj
    );
  }

  authenticate(){
    var username = this.form.controls['username'].value
    var password = this.form.controls['password'].value
    this.javaService.authenticate(username,password).subscribe(
      {
        next:(res) => {
          console.log('login sucess',res)
        },
        error:(err) => {
          console.log("login error", err)
        }
      }
    )
  }
  openDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
        data: {
          form: this.form
        }
      })
    dialogRef.afterClosed().subscribe(result => {
      this.blur = false
      this.authenticate()
    });
  }
}
