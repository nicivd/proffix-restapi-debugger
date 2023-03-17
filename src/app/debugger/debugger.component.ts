import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PxLoginService } from '@proffix/restapi-angular-library';
import { HttpMethod } from '../models/http-method';


@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit {

  debuggerForm!: FormGroup;
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.debuggerForm = this.formBuilder.group({
      httpMethod: ['', Validators.required],
      requestInput: ['', Validators.required],
    })
    this.checkLogin();
  }

  checkLogin(): void {
    if (!this.pxloginService.isAutoLoginActive) {
      if (!this.pxloginService.isLoggedIn) {
        this.router.navigateByUrl('/login');
      }
    }
  }

  sendRequest() {

  }

}
