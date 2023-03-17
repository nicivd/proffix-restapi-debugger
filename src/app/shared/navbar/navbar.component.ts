import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { PxLocalStorageService, PxLoginService } from '@proffix/restapi-angular-library';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(
    private pxloginService: PxLoginService,
    private pxlocalStorageService: PxLocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/connection') {
          this.loggedIn = false;
        } else {
          this.loggedIn = true;
        }
      }
    })
  }

  doLogout() {
    this.pxloginService.doLogout()
      .subscribe({
        next: () => {
          this.pxloginService.removeAutoLogin();
          this.pxlocalStorageService.remove('Proffix.CurrentUser');
          this.router.navigateByUrl('/login');
        },
        error: (error) => {

        }
      })
  }

}
