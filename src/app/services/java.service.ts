import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class JavaService {

  constructor(private httpClient:HttpClient) { }

  authenticate(username:string,password:string){

    var body = {
        username:username,
        password:password
    }

    return this.httpClient.post<Object>("/api/authenticate", body)
  }

  signup(form:FormGroup){

    var body = {
        username:form.controls['username'].value,
        password:form.controls['password'].value,
        email:form.controls['email'].value,
        name:form.controls['name'].value,
        enabled:form.controls['enabled'].value,
        role:form.controls['role'].value
    }
    
    return this.httpClient.post<Object>("/api/signup", body)
  }

  getUsers(){
    return this.httpClient.get("/api/users")
  }

  updateUser(user:any){
    var updUser:any = {
      username: user.username,
      email: user.email,
      name: user.name 
    }
    if(user.password){
      updUser.password = user.password
    }
    if(user.enabled != undefined){
      updUser.enabled = user.enabled
    }
    if(user.role){
      updUser.role = user.role.roleName
    }
    return this.httpClient.put(`/api/users/${user.username}`,updUser)
  }
}
