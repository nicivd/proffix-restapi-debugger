import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PxDatenbank, PxDatenbankService, PxLoginService, PxLogin, PxHash } from '@proffix/restapi-angular-library';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showError: boolean = false;

  databaseList: PxDatenbank[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private databaseService: PxDatenbankService,
    private loginService: PxLoginService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      pxdatabase: ['', Validators.required],
      pxusername: ['', Validators.required],
      pxuserpassword: ['', Validators.required]
    })
    this.loadDatabases();
  }

  public login(): void {
    let login: PxLogin = {
      Datenbank: { Name: this.loginForm.value.pxdatabase },
      Benutzer: this.loginForm.value.pxusername,
      Passwort: PxHash.sha256(this.loginForm.value.pxuserpassword)
    };
    this.loginService.doLogin(login, false)
      .subscribe({
        next: (isValid) => {
          if (isValid) {
            this.successToast();
            this.showError = false;
            this.router.navigateByUrl('/debugger');
            console.log(login);
          }
        },
        error: (error) => {
          this.showError = true;
          console.log(error);
        }
      })
  }

  logout(): void {
    this.loginService.doLogout();
    this.router.navigateByUrl('/connection');
  }

  public getDatabases(): Observable<PxDatenbank[]> {
    return this.databaseService.getAll();
  }

  public loadDatabases(): void {
    this.getDatabases().subscribe({
      next: (databases) => {
        databases.forEach(database => {
          this.databaseList.push(database);
        })
        console.log(this.databaseList);
      }
    })
  }

  public successToast(): void {
    this.toastService.show('Login erfolgreich!', { classname: 'bg-success text-light', delay: 6000 });
  }
}
