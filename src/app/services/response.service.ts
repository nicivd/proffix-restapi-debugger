import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Response } from '../models/response';
import { PxConnectionSettingsService } from 'projects/lib/src/public-api';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  responseSubject = new BehaviorSubject<Array<Response>>([]);
  responseList = Array<Response>();

  requestUrl: string = '';
  url: string = '';
  formattedReq: string = '';
  reqBody: any;
  reqID!: Guid;

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

  public generateID(): void {
    this.reqID = Guid.create();
  }

  public addToLog(color: number, httpMethod: string, duration: number, statuscode: number, type: any, request: string, response: any): void {
    this.getURL(request);
    this.generateID();
    const responseInfo: Response = {
      id: this.reqID.toString(),
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
    this.responseSubject.next(this.responseList);
  }

  public deleteLogitem(id: string): void {

  }


}
