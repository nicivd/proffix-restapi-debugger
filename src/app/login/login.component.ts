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
  showDatabaseError: boolean = false;
  showUsernameError: boolean = false;
  showPasswordError: boolean = false;

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
    if (this.loginForm.valid) {
      this.showDatabaseError = false;
      this.showUsernameError = false;
      this.showPasswordError = false;
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
    else {
      if (this.loginForm.value.pxdatabase === "") {
        this.showDatabaseError = true;
      }
      if (this.loginForm.value.pxusername === "") {
        this.showUsernameError = true;
      }
      if (this.loginForm.value.pxuserpassword === "") {
        this.showPasswordError = true;
      }
    }
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
