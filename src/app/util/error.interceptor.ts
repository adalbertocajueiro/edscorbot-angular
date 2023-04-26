import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === HttpStatusCode.Unauthorized) {
          /*
          console.log("unauthorized")
          console.log("document.location.href",document.location.href)
          console.log("window.location.href",window.location.href)
          console.log("window.location.host",window.location.host)
          console.log("window.location.hostname",window.location.hostname)
          console.log("window.location.protocol",window.location.protocol)
          console.log("window.location.port",window.location.port)
          console.log("window.location.origin",window.location.origin)
          */

          window.location.href = window.location.origin + `/message?message=${response.error}&type=warning_amber&redirecturi=/login`

        } else if (response.status === HttpStatusCode.PreconditionFailed){

          window.location.href = window.location.origin + `/message?message=${response.error}&type=error&redirecturi=/login`
        } 
        return throwError(() => response);
      })
    );
  }
}
