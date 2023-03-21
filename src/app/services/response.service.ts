import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Response } from '../models/response';
import { PxConnectionSettingsService } from 'projects/lib/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  public responseSubject = new BehaviorSubject<Array<Response>>([]);
  public responseList = Array<Response>();

  requestUrl: string = "";
  url: string = "";
  formattedReq: string = "";
  reqBody: any;

  constructor(
    private pxConnService: PxConnectionSettingsService
  ) { }

  public getResponseObservable(): Observable<Array<Response>> {
    return this.responseSubject.asObservable();
  }

  public getURL(request: string): void {
    this.getBaseURL();
    this.formattedReq = request.slice(this.url.length);
  }

  public getBaseURL(): void {
    let conn = this.pxConnService.load();
    this.url = conn.WebserviceUrl;
  }

  public getRequestBody(body: any): void {
    this.reqBody = JSON.parse(body);
  }

  public addToLog(color: number, httpMethod: string, duration: number, statuscode: number, type: any, request: string, response: any): void {
    this.getURL(request);
    const responseInfo: Response = {
      color: color,
      httpMethod: httpMethod,
      duration: duration,
      statuscode: statuscode,
      type: type,
      request: this.formattedReq,
      responseBody: response,
      requestBody: this.reqBody
    };
    this.responseList.unshift(responseInfo);
    this.responseSubject.next(this.responseList);
    console.log(this.responseList);
  }

  public resetList(): void {
    this.responseList = [];
  }


}
