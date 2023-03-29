import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JavaService {

  constructor(private httpClient:HttpClient) { }

  authenticate(username:string,password:string){

    var formData:FormData = new FormData();
    var body = {
        username:"root",
        password:"edscorbot"
    }
    formData.set('username', username)
    formData.set('password',password)
    return this.httpClient.post("/api/authent", formData)
  }
}
