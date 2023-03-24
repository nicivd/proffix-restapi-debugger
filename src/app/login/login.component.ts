import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PxDatenbank, PxDatenbankService, PxLoginService, PxLogin, PxHash, PxLocalStorageService } from 'projects/lib/src/public-api';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ResponseService } from '../services/response.service';
import { TimerService } from '../services/timer.service';

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
  showSpinner: boolean = this.timerService.showSpinner;

  databaseList: PxDatenbank[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private pxdatabaseService: PxDatenbankService,
    private pxloginService: PxLoginService,
    private toastService: ToastService,
    private router: Router,
    private pxlogalStorageService: PxLocalStorageService,
    private responseService: ResponseService,
    private timerService: TimerService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      pxdatabase: ['', Validators.required],
      pxusername: ['', Validators.required],
      pxuserpassword: ['', Validators.required],
      checkautologin: [false]
    });
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
      try {
        this.pxloginService.doLogin(login, this.loginForm.value.checkautologin)
          .subscribe({
            next: (login) => {
              if (login) {
                this.successToast();
                this.showError = false;
                this.pxlogalStorageService.set('PROFFIX.CurrentUser', login.Benutzer);
                this.pxlogalStorageService.set('PROFFIX.Database', login.Datenbank.Name);
              }
            },
            error: (errorMessage) => {
              this.showError = true;
              if (errorMessage.error?.Message) {
                this.toastService.show(errorMessage.error.Message, { classname: 'bg-danger text-light', delay: 5000 });
              }
              if (errorMessage.Status === 403) {
                this.toastService.show('Benutzername oder Passwort falsch', { classname: 'bg-danger text-light', delay: 5000 });
              }
            },
            complete: () => {
              this.responseService.resetList();
              this.router.navigateByUrl('/debugger');
            }
          })
      } catch (error) {
        reportError(error);
      }
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

  public logout(): void {
    this.pxloginService.doLogout();
    this.router.navigateByUrl('/connection');
  }

  public getDatabases(): Observable<PxDatenbank[]> {
    return this.pxdatabaseService.getAll();
  }

  public loadDatabases(): void {
    this.getDatabases().subscribe({
      next: (databases) => {
        databases.forEach(database => {
          this.databaseList.push(database);
        })
      },
      error: (error) => {
        this.toastService.show('Keine Datenbank vorhanden', { classname: 'bg-danger text-light', delay: 5000 });
      }
    })
  }

  public successToast(): void {
    this.toastService.show('Login erfolgreich!', { classname: 'bg-success text-light', delay: 6000 });
  }
}
