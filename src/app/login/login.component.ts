import { Component, OnInit } from '@angular/core';
import { PxDatenbank } from '@proffix/restapi-angular-library';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  // public getDatabases(): Observable<PxDatenbank[]> {
  //    return this.pxdatabaseService.getAll();
  // }

  // public loadDatabases(): void {
  //   this.getDatabases().subscribe({
  //     next: (db) => {
  //       console.log(db);
  //     }
  //   })
  // }
}
