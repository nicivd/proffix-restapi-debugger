import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PxConnectionSettingsService, PxConnectionSettings, PxHash, PxHttpService, PxInfoService } from '@proffix/restapi-angular-library';
import { Router } from '@angular/router';
import { AppConfiguration } from '../app.configuration';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  restapiForm!: FormGroup;
  showError: boolean = false;
  //restApiFormSubmitted = false;

  constructor(
    private connectionSettingsService: PxConnectionSettingsService,
    private httpService: PxHttpService,
    private formBuilder: FormBuilder,
    private infoService: PxInfoService,
    private router: Router,
    private appconfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    this.restapiForm = this.formBuilder.group({
      restapiurl: ['', Validators.required],
      restapipassword: ['', Validators.required]
    })
  }

  public connectToRESTAPI(): void {
    let connectionSettings: PxConnectionSettings = {
      WebserviceUrl: this.restapiForm.value.restapiurl,
      WebservicePasswortHash: PxHash.sha256(this.restapiForm.value.restapipassword)
    };
    this.connectionSettingsService.save(connectionSettings);
    this.isConnectionValid();
  }

  public isConnectionValid(): void {
    this.infoService.isAppCompatible()
      .subscribe({
        next: (isValid) => {
          if (isValid) {
            this.router.navigateByUrl('/login')
          }
        },
        error: (errorResponse) => {
          if (errorResponse.Status === 404) {
            this.showError = true;
          }
        }
      })
  }

}
