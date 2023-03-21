import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { PxHttpService, PxLoginService } from 'projects/lib/src/public-api';
import { HttpMethod } from '../models/http-method';
import { ToastService } from '../services/toast.service';
import { ResponseService } from '../services/response.service';
import { Response } from '../models/response';
import { Subject, takeUntil } from 'rxjs';
import { TimerService } from '../services/timer.service';
import { RequestInterceptor } from '../interceptors/request.interceptor';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit, OnDestroy {

  debuggerForm!: FormGroup;
  showReqBody: boolean = false;
  isCollapsed = true;
  isCollapsed2 = true;
  errorMessage: string = "";

  responseList = new Array<Response>();
  unsubscribe = new Subject<void>();

  pxsessionID = RequestInterceptor.pxSessionId;

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
    private timerService: TimerService,
  ) { }

  ngOnInit(): void {
    this.debuggerForm = this.formBuilder.group({
      httpMethod: ['GET', Validators.required,],
      requestInput: ['', Validators.required],
      requestBody: ['']
    });
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/connection') {
          this.responseService.resetList()
        }
      }
    })
    this.checkLogin();
    this.getResponseList();
  }

  public getResponseList(): void {
    this.responseService.getResponseObservable()
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (response: Response[]) => {
          this.responseList = response;
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
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
    try {
      this.errorMessage = '';
      let httpMethod = this.debuggerForm.value.httpMethod;
      switch (httpMethod) {
        case 'GET': {
          this.sendGetRequest();
          break;
        }
        case 'POST': {
          this.sendPostRequest();
          break;
        }
        case 'PUT': {
          this.sendPutRequest();
          break;
        }
        case 'PATCH': {
          this.sendPatchRequest();
          break;
        }
        case 'DELETE': {
          this.sendDeleteRequest();
          break;
        }
      }
    } catch (error) {
      reportError(error);
    }

  }

  public sendGetRequest(): void {
    try {
      this.timerService.setTimer();
      this.pxhttpService.get(this.debuggerForm.value.requestInput).subscribe()
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      reportError({ message });
    }
  }

  public sendPostRequest(): void {
    try {
      let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
      this.responseService.getRequestBody(this.debuggerForm.value.requestBody);
      this.timerService.setTimer();
      this.pxhttpService.post(this.debuggerForm.value.requestInput, requestBody).subscribe()
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      if (message === "Unexpected end of JSON input") {
        this.errorMessage = "Request Body ist leer oder fehlerhaft!";
      } else {
        this.errorMessage = message;
      }
    }

  }

  public sendPutRequest(): void {
    try {
      let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
      this.timerService.setTimer();
      this.pxhttpService.put(this.debuggerForm.value.requestInput, requestBody).subscribe()
    } catch (error) {
      reportError(error);
    }

  }

  public sendPatchRequest(): void {
    try {
      let requestBody = JSON.parse(this.debuggerForm.value.requestBody);
      this.timerService.setTimer();
      this.pxhttpService.patch(this.debuggerForm.value.requestInput, requestBody).subscribe()
    } catch (error) {
      reportError(error);
    }
  }

  public sendDeleteRequest(): void {
    try {
      this.timerService.setTimer();
      this.pxhttpService.delete(this.debuggerForm.value.requestInput).subscribe()
    } catch (error) {
      reportError(error);
    }

  }
}
