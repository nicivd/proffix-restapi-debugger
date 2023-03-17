import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PxConnectionSettingsService, PxHttpService, PxLocalStorageService, PxLoginService, PxUrlFormatter } from '@proffix/restapi-angular-library';
import { HttpMethod } from '../models/http-method';
import { HttpClient } from '@angular/common/http';
import { Patch } from '../models/patch';
import { ToastService } from '../services/toast.service';
import { catchError, EMPTY, map } from 'rxjs';


@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit {

  debuggerForm!: FormGroup;
  showReqBody: boolean = false;

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
    private httpClient: HttpClient,
    private connectionService: PxConnectionSettingsService,
    private pxlogalStorageService: PxLocalStorageService
  ) { }

  ngOnInit(): void {
    this.debuggerForm = this.formBuilder.group({
      httpMethod: ['GET', Validators.required,],
      requestInput: ['', Validators.required],
      requestBody: ['']
    })
    this.checkLogin();
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
        //this.sendPatchRequest();
        console.log("PATCH");
        break;
      }
      case "DELETE": {
        this.sendDeleteRequest();
        console.log("DELETE");
        break;
      }
    }
  }

  public sendGetRequest(): void {
    this.pxhttpService.get(this.debuggerForm.value.requestInput)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          if (!this.pxloginService.isAutoLoginActive) {
            console.log(error);
          }
        }
      })
  }

  public sendPostRequest(): void {
    let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
    this.pxhttpService.post(this.debuggerForm.value.requestInput, requestBody)
      .subscribe({
        next: (response) => {
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
          console.log(response);
        },
        error: (error) => {
          if (!this.pxloginService.isAutoLoginActive) {
            console.log(error);
          }
        }
      })
  }

  // TODO

  // public sendPatchRequest(): void {
  //   let request = PxUrlFormatter.getAbsolutUrl(this.debuggerForm.value.requestInput, this.connectionService.load().WebserviceUrl);
  //   let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
  //   console.log(request);
  //   this.httpClient.patch<void>(request, requestBody)
  //     .subscribe({
  //       next: (val) => {
  //         console.log(val);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       }
  //     })
  // }

  public sendDeleteRequest(): void {
    this.pxhttpService.delete(this.debuggerForm.value.requestInput)
      .subscribe({
        next: (response) => {
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
