import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JavaService {

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) { }

  authenticate(username: string, password: string) {

    var body = {
      username: username,
      password: password
    }

    return this.httpClient.post<Object>(environment.javaAPI.JAVA_API_URL + "/api/authenticate", body)
  }

  signup(form: FormGroup) {

    var body = {
      username: form.controls['username'].value,
      password: form.controls['password'].value,
      email: form.controls['email'].value,
      name: form.controls['name'].value,
      enabled: form.controls['enabled'].value,
      role: form.controls['role'].value
    }

    return this.httpClient.post<Object>(environment.javaAPI.JAVA_API_URL + "/api/signup", body)
  }

  getUsers() {
    return this.httpClient.get(environment.javaAPI.JAVA_API_URL + "/api/users")
  }

  updateUser(user: any) {
    return this.httpClient.put(environment.javaAPI.JAVA_API_URL + `/api/users/${user.username}`, user)
  }

  getTrajectories() {
    return this.httpClient.get(environment.javaAPI.JAVA_API_URL + "/api/trajectories")
  }

  saveTrajectory(trajectory: any) {
    return this.httpClient.post(environment.javaAPI.JAVA_API_URL + "/api/trajectories", trajectory)
  }

  deleteTrajectory(trajectory: any) {
    return this.httpClient.delete(environment.javaAPI.JAVA_API_URL + "/api/trajectories/" + trajectory.timestamp)
  }
}
