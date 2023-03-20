import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PxConnectionSettingsService, PxHttpService, PxLocalStorageService, PxLoginService, PxUrlFormatter } from 'projects/lib/src/public-api';
import { HttpMethod } from '../models/http-method';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { ResponseService } from '../services/response.service';
import JSONFormatter from 'json-formatter-js'
import { Response } from '../models/response';


@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit {

  debuggerForm!: FormGroup;
  showReqBody: boolean = false;
  isCollapsed = true;
  isCollapsed2 = true;

  responseList = new Array<Response>();

  httpMethodList: HttpMethod[] = [
    { id: 0, name: "GET" },
    { id: 1, name: "POST" },
    { id: 2, name: "PUT" },
    { id: 3, name: "PATCH" },
    { id: 4, name: "DELETE" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private pxloginService: PxLoginService,
    private pxhttpService: PxHttpService,
    private router: Router,
    private toastService: ToastService,
    private responseService: ResponseService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    this.debuggerForm = this.formBuilder.group({
      httpMethod: ['GET', Validators.required,],
      requestInput: ['', Validators.required],
      requestBody: ['']
    })
    this.checkLogin();
    this.getResponseList();
  }

  public getResponseList(): void {
    this.responseService.getResponseObservable()
      .subscribe(
        (response: Response[]) => {
          this.responseList = response;
        });
  }

  public checkLogin(): void {
    if (!this.pxloginService.isAutoLoginActive) {
      if (!this.pxloginService.isLoggedIn) {
        this.router.navigateByUrl('/login');
        this.toastService.show('Sie sind ausgeloggt.', { classname: 'bg-danger text-light', delay: 6000 });
      }
    }
  }

  public sethttpBody(): void {
    let httpMethod = this.debuggerForm.value.httpMethod;
    if (httpMethod === "POST" || httpMethod === "PUT" || httpMethod === "PATCH") {
      this.showReqBody = true;
    } else {
      this.showReqBody = false;
    }
  }

  public validateRequest(): void {
    let httpMethod = this.debuggerForm.value.httpMethod;
    switch (httpMethod) {
      case "GET": {
        this.sendGetRequest();
        break;
      }
      case "POST": {
        this.sendPostRequest();
        break;
      }
      case "PUT": {
        this.sendPutRequest();
        break;
      }
      case "PATCH": {
        this.sendPatchRequest();
        console.log("PATCH");
        break;
      }
      case "DELETE": {
        this.sendDeleteRequest();
        break;
      }
    }
  }

  public sendGetRequest(): void {
    this.pxhttpService.get(this.debuggerForm.value.requestInput, { observe: 'response' })
      .subscribe({
        next: (response) => {
          this.responseService.addToLog(0, "GET", this.debuggerForm.value.requestInput, response);
        },
        error: (error) => {
          if (!this.pxloginService.isAutoLoginActive) {
            console.log(error);
          }
        },
      })
  }

  public sendPostRequest(): void {
    let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
    this.pxhttpService.post(this.debuggerForm.value.requestInput, requestBody)
      .subscribe({
        next: (response) => {
          this.responseService.addToLog(0, "POST", this.debuggerForm.value.requestInput, response, requestBody);
          console.log(response, requestBody);
        },
        error: (error) => {
          if (!this.pxloginService.isAutoLoginActive) {
            console.log(error);
          }
        }
      })
  }

  public sendPutRequest(): void {
    let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
    this.pxhttpService.put(this.debuggerForm.value.requestInput, requestBody)
      .subscribe({
        next: (response) => {
          this.responseService.addToLog(0, "PUT", "", response, requestBody);
          console.log(response);
        },
        error: (error) => {
          if (!this.pxloginService.isAutoLoginActive) {
            console.log(error);
          }
        }
      })
  }

  public sendPatchRequest(): void {
    let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
    this.pxhttpService.patch(this.debuggerForm.value.requestInput, requestBody)
      .subscribe({
        next: (response) => {
          this.responseService.addToLog(0, "PATCH", this.debuggerForm.value.requestInput, response!, requestBody);
          console.log(response);
        },
        error: (error) => {
          if (!this.pxloginService.isAutoLoginActive) {
            console.log(error);
          }
        }
      })
  }

  public sendDeleteRequest(): void {
    this.pxhttpService.delete(this.debuggerForm.value.requestInput)
      .subscribe({
        next: (response) => {
          this.responseService.addToLog(0, "DELETE", this.debuggerForm.value.requestInput, "Adresse wurde gelöscht!");
          console.log(response);
        },
        error: (error) => {
          if (!this.pxloginService.isAutoLoginActive) {
            console.log(error);
          }
        }
      })
  }
}
