import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Response } from '../models/response';


@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  public responseSubject = new BehaviorSubject<Array<Response>>([]);
  public responseList = Array<Response>();

  constructor() { }

  public getResponseObservable(): Observable<Array<Response>> {
    return this.responseSubject.asObservable();
  }

  public addToLog(color: number, httpMethod: string, statuscode: number, type: string, request: string, response: any, requestBody?: any): void {
    if (requestBody) {
      const responseInfo: Response = { color: color, httpMethod: httpMethod, statuscode: statuscode, type: type, request: request, responseBody: response, requestBody: requestBody };
      this.responseList.unshift(responseInfo);
    } else {
      const responseInfo: Response = { color: color, httpMethod: httpMethod, statuscode: statuscode, type: type, request: request, responseBody: response };
      this.responseList.unshift(responseInfo);
    }
    this.responseSubject.next(this.responseList);
    console.log(this.responseList);
  }
}
