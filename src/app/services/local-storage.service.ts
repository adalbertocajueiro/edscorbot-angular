import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  USERNAME_KEY:string = 'username'
  USERFULLNAME_KEY:string = 'userfullname'
  USERTOKEN_KEY:string = 'usertoken'
  USERROLE_KEY:string = 'userrole'
  loggedUser:any

  userChanged:EventEmitter<any> = new EventEmitter<any>()

  constructor() { }

  public saveLoggedUser(user:any){
    localStorage.setItem(this.USERNAME_KEY,user.username)
    localStorage.setItem(this.USERFULLNAME_KEY,user.name)
    localStorage.setItem(this.USERTOKEN_KEY,user.token)
    localStorage.setItem(this.USERROLE_KEY,user.role)
    this.loggedUser = this.getLoggedUser()
    this.userChanged.emit(this.loggedUser)
  }

  public clearLoggedUser(){
    localStorage.removeItem(this.USERNAME_KEY)
    localStorage.removeItem(this.USERFULLNAME_KEY)
    localStorage.removeItem(this.USERTOKEN_KEY)
    localStorage.removeItem(this.USERROLE_KEY)
    this.loggedUser = undefined
    this.userChanged.emit(this.loggedUser)
  }

  public getLoggedUser(){
    var user = undefined
    if(localStorage.getItem(this.USERNAME_KEY)){
      user = {
        username: localStorage.getItem(this.USERNAME_KEY),
        name: localStorage.getItem(this.USERFULLNAME_KEY),
        token: localStorage.getItem(this.USERTOKEN_KEY),
        role: localStorage.getItem(this.USERROLE_KEY)
      }
    }
    return user
  }

  public isLoggedIn$(): Observable<boolean>{
    return of(false)
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  public getData(key: string) {
    return localStorage.getItem(key)
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }
  public clearData() {
    localStorage.clear();
  }
}
