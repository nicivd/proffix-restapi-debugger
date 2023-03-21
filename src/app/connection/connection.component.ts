import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PxConnectionSettingsService, PxConnectionSettings, PxHash, PxInfoService } from 'projects/lib/src/public-api';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  restapiForm!: FormGroup;
  showError: boolean = false;
  showURLError: boolean = false;
  showPasswordError: boolean = false;

  constructor(
    private pxconnectionSettingsService: PxConnectionSettingsService,
    private formBuilder: FormBuilder,
    private pxinfoService: PxInfoService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.restapiForm = this.formBuilder.group({
      restapiurl: ['', Validators.required],
      restapipassword: ['', Validators.required]
    });
  }

  public connectToRESTAPI(): void {
    if (this.restapiForm.valid) {
      this.showURLError = false;
      this.showPasswordError = false;
      let connectionSettings: PxConnectionSettings = {
        WebserviceUrl: this.restapiForm.value.restapiurl,
        WebservicePasswortHash: PxHash.sha256(this.restapiForm.value.restapipassword)
      };
      this.pxconnectionSettingsService.save(connectionSettings);
      this.isConnectionValid();
    }
    else if (this.restapiForm.touched) {
      if (this.restapiForm.value.restapiurl === "") {
        this.showURLError = true;
      }
      if (this.restapiForm.value.restapipassword === "") {
        this.showPasswordError = true;
      }
    }
  }

  public isConnectionValid(): void {
    this.pxinfoService.isAppCompatible()
      .subscribe({
        next: (connection) => {
          if (connection) {
            this.successToast();
            this.router.navigateByUrl('/login')
          }
        },
        error: (error) => {
          this.showError = true;
          if (error.error?.Message) {
            this.toastService.show(error.error.Message, { classname: 'bg-danger text-light', delay: 6000 });
          }
        }
      })
  }

  public successToast(): void {
    this.toastService.show('Verbindung erfolgreich!', { classname: 'bg-success text-light', delay: 6000 });
  }
}
