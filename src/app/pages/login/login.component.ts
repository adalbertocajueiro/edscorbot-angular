import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JavaService } from 'src/app/services/java.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  form:FormGroup = new FormGroup({})
  blur:boolean = true

  constructor(private javaService:JavaService, 
              private dialog:MatDialog,
              private formBuilder: FormBuilder,
              private localStorageService:LocalStorageService,
              private router:Router){

  }
  ngOnInit(): void {
    this.buildForm()
    this.openDialog()
  }

  public buildForm() {
    var controlUsername = new FormControl('',[Validators.required]) 
    var controlPassword = new FormControl('',[Validators.required])  
    var controlEmail = new FormControl('',[Validators.email]) 
    var controlFullName = new FormControl('',[Validators.required])
    var controlEnabled = new FormControl(false,[Validators.required])
    var controlRole = new FormControl('USER', [Validators.required])

    var obj: any = {}
    obj['username'] = controlUsername
    obj['password'] = controlPassword
    obj['email'] = controlEmail
    obj['name'] = controlFullName
    obj['enabled'] = controlEnabled
    obj['role'] = controlRole

    this.form = this.formBuilder.group(
        obj
    );
  }

  authenticate(){
    var username = this.form.controls['username'].value
    var password = this.form.controls['password'].value
    this.javaService.authenticate(username,password).subscribe(
      {
        next:(res:any) => {
          console.log('login sucess',res)
          //store information in local storage
          // if the user is enabled then saves in local storage
          if(res.enabled == true){
            this.localStorageService.saveLoggedUser(res)
            this.router.navigate(["/"])
          } else {
            //manda uma mensagem e volta pra tela de login com uma mensagem
            this.router.navigate(["/","error"])
          }
          
        },
        //error:(err) => {
        //  console.log("login error", err)
        //  this.router.navigate(["/","error"])
        //}
      }
    )
  }
  signup(){
    this.javaService.signup(this.form).subscribe(
        {
          next:(res) => {
            console.log('signup success',res)
          },
          error:(err) => {
            console.log("signup error", err)
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
      console.log('login dialog closed')
      if(this.form.valid){ //all fields are filled and this is a signup
        this.signup()
      } else { //sign in
        this.authenticate()
      }
      //this.authenticate()
    });
  }
}
