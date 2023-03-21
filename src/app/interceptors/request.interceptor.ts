import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseService } from '../services/response.service';
import { TimerService } from '../services/timer.service';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  static pxSessionId: string | null = '';

  constructor(
    private responseService: ResponseService,
    private timerService: TimerService,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    //Create sessionID
    if (request.headers.get('PxSessionId') !== null) {
      RequestInterceptor.pxSessionId = request.headers.get('PxSessionId');
    }
    else {
      RequestInterceptor.pxSessionId = '';
    }

    return next.handle(request)
      .pipe(
        map(response => {
          if (response instanceof HttpResponse) {
            this.responseService.addToLog(
              0,
              request.method,
              this.timerService.getTimer(),
              response.status,
              response.statusText,
              request.url,
              response.body,
            )
          }
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error) {
            this.responseService.addToLog(
              1,
              request.method,
              this.timerService.getTimer(),
              error.status,
              error.statusText,
              request.url,
              error.error,
            )
          }
          return throwError(() => error);
        })
      )

  }
}
