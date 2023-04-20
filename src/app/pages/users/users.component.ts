import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JavaService } from 'src/app/services/java.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  constructor(private javaService:JavaService, 
              private localStorageService:LocalStorageService,
              private formBuilder: FormBuilder){
            
  }
  
  form:FormGroup = new FormGroup({})
  loggedUser!:any
  users:any[] = []
  fieldEdited:boolean = false

  ngOnInit(): void {
    this.loggedUser = this.localStorageService.getLoggedUser()
    //console.log('user',this.loggedUser)
    this.buildForm()
    this.loadUsers()
  }

  loadUsers(){
    this.javaService.getUsers().subscribe(
      {
        next: (res) => { 
          //console.log('users',res)
          this.users = res as any[]
        },
        error: (err) => { console.log('users error',err)}
      }
    )
  }

  public buildForm() {
    var controlUsername = new FormControl(this.loggedUser.username) 
    var controlPassword = new FormControl('')  
    var controlEmail = new FormControl(this.loggedUser.email,[Validators.email]) 
    var controlFullName = new FormControl(this.loggedUser.name)
    var controlRole = new FormControl(this.loggedUser.role.roleName)
    var controlEnabled = new FormControl(true)

    var obj: any = {}
    obj['username'] = controlUsername
    obj['password'] = controlPassword
    obj['email'] = controlEmail
    obj['name'] = controlFullName
    obj['role'] = controlRole
    obj['enabled'] = controlEnabled

    this.form = this.formBuilder.group(
        obj
    );
  }

  changeRole(event:any,user:any){
    
    var newUser = {
      username:user.username,
      email:user.email,
      password:"",
      role: this.getSelectedOption(event.target.options)?.innerText,
      name:user.name,
      enabled: user.enabled
    }

    this.javaService.updateUser(newUser).subscribe(
      {
        next: (res)=> {
          console.log('usuario atualizado', res)
          this.loadUsers()
        },
        error: (err) => {
          console.log('error', err)
        }
      }
    )
    
  }

  changeEnabled(event:any,user:any){
    //console.log('enabled changed',user)
    //user.enabled = event.target.checked
    //user.password = ""
    var updUser = {
      username:user.username,
      email:user.email,
      password:"",
      role: user.role.roleName,
      name:user.name,
      enabled: event.target.checked
    }
    
    this.javaService.updateUser(updUser).subscribe(
      {
        next: (res)=> {
          this.loadUsers()
        },
        error: (err) => {
          console.log('error', err)
        }
      }
    )
    
  }

  getSelectedOption(options:HTMLOptionsCollection){
    return options.item(options.selectedIndex)
  }

  resetPassword(user:any){
    user.password = user.username
    user.role = user.role.roleName
    this.javaService.updateUser(user).subscribe(
      {
        next: (res)=> {
          console.log('usuario atualizado', res)
        },
        error: (err) => {
          console.log('error', err)
        }
      }
    )
  }
  updateUser(){
    //console.log('form', this.form)
    var userUpd:any = {
        username:this.form.controls['username'].value,
        email:this.form.controls['email'].value,
        name:this.form.controls['name'].value,
        enabled:this.form.controls['enabled'].value,
        role:this.form.controls['role'].value
    }

    if(this.form.controls['password'].value.length > 0){
      userUpd.password = this.form.controls['password'].value
    }
    //console.log('user to update', userUpd, this.form)
    this.javaService.updateUser(userUpd).subscribe(
      {
        next: (res)=> {
          console.log('usuario atualizado', res)
        },
        error: (err) => {
          console.log('error', err)
        }
      }
    )
  }
}
