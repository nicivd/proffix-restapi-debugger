import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PxHttpService, PxLoginService } from '@proffix/restapi-angular-library';
import { HttpMethod } from '../models/http-method';
import { ToastService } from '../services/toast.service';


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
    private toastService: ToastService
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

  public sendRequest(): void {
    let httpMethod = this.debuggerForm.value.httpMethod;
    switch (httpMethod) {
      case "GET": {
        this.requestGet();
        console.log("GET");
        break;
      }
      case "POST": {
        console.log("POST");
        break;
      }
      case "PUT": {
        console.log("PUT");
        break;
      }
      case "PATCH": {
        console.log("PATCH");
        break;
      }
      case "DELETE": {
        console.log("DELETE");
        break;
      }
    }
  }

  public requestGet(): void {
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


}
