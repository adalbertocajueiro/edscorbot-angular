import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  currentRoute:string = ""

  constructor(private localStorageService:LocalStorageService, private router:Router){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      var loggedUser = this.localStorageService.getLoggedUser()
      //console.log('saved user', loggedUser)
      //return (loggedUser != null && loggedUser != undefined)
      
      if(!loggedUser){
        
        return this.localStorageService.isLoggedIn$("test").pipe(
          //tap( () => this.router.navigate(["/","login"]))
          tap( () => this.router.navigate([this.currentRoute]))
        )
      } else{
        return true
      }
      
  }
  
}
