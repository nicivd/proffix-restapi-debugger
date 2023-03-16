import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PxConnectionSettingsService, PxConnectionSettings, PxHash, PxInfoService } from '@proffix/restapi-angular-library';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  restapiForm!: FormGroup;
  showError: boolean = false;

  constructor(
    private connectionSettingsService: PxConnectionSettingsService,
    private formBuilder: FormBuilder,
    private infoService: PxInfoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.restapiForm = this.formBuilder.group({
      restapiurl: ['', Validators.required],
      restapipassword: ['', Validators.required]
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.restapiForm.controls;
  }

  public connectToRESTAPI(): void {
    if (this.restapiForm.valid) {
      let connectionSettings: PxConnectionSettings = {
        WebserviceUrl: this.restapiForm.value.restapiurl,
        WebservicePasswortHash: PxHash.sha256(this.restapiForm.value.restapipassword)
      };
      this.connectionSettingsService.save(connectionSettings);
      this.isConnectionValid();
    }
  }

  public isConnectionValid(): void {
    this.infoService.isAppCompatible()
      .subscribe({
        next: (isValid) => {
          if (isValid) {
            this.router.navigateByUrl('/login')
          }
        },
        error: (error) => {
          this.showError = true;
          console.log(error);
        }
      })
  }
}