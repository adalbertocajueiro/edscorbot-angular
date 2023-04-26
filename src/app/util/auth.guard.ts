import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  currentRoute?: string

  constructor(private localStorageService: LocalStorageService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    var loggedUser = this.localStorageService.getLoggedUser()
    //console.log('saved user', loggedUser)
    //return (loggedUser != null && loggedUser != undefined)
    //console.log("current route", this.currentRoute)
    if (loggedUser == undefined) {
      return this.localStorageService.isLoggedIn$().pipe(
        tap(() => this.router.navigate(["/", "login"]))
      )
    } else {
      return true
    }

  }

}
