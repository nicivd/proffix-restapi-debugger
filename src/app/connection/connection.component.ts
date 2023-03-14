import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PxConnectionSettingsService, PxConnectionSettings, PxHash, PxHttpService } from '@proffix/restapi-angular-library';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  restapiForm!: FormGroup;
  //restApiFormSubmitted = false;

  constructor(
    private connectionSettingsService: PxConnectionSettingsService,
    private httpService: PxHttpService,
    private formBuilder: FormBuilder,
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

  public isConnectionValid() {
    console.log(this.httpService.get('/PRO/info'));
  }

  // public getDatabases(): Observable<PxDatenbank[]> {
  //   return this.pxdatabaseService.getAll();
  // }

  // public loadDatabases(): void {
  //   this.getDatabases().subscribe({
  //     next: (db) => {
  //       console.log(db);
  //     }
  //   })
  // }
}
