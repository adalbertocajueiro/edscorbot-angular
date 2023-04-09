import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private localStorageService:LocalStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    var authReq = request.clone();

    var loggedUser = this.localStorageService.getLoggedUser()
    //console.log('logged user', loggedUser)
    //console.log('request', request.url, loggedUser)
    if(loggedUser){
      authReq = request.clone({
        headers: request.headers
                  .set('Authorization', `Bearer ${loggedUser.token}`)
                  .set('username',loggedUser.username!),
      });
      //console.log('adding data to header', authReq)
    }
    return next.handle(authReq);
  }
}
