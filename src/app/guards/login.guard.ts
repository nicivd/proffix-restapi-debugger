import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { PxLoginService } from 'projects/lib/src/public-api';
import { catchError, EMPTY, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private pxloginService: PxLoginService,
  ) { }

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    if (this.pxloginService.isLoggedIn) {
      return true;
    }
    else if (this.pxloginService.isAutoLoginActive) {
      return this.pxloginService.doLogin()
        .pipe(
          map((auth) => {
            return true;
          }),
          catchError((error) => {
            this.pxloginService.removeAutoLogin();
            this.pxloginService.doLogout();
            this.router.navigateByUrl('/login')
            return EMPTY;
          })
        )
    } else {
      this.router.navigateByUrl('/login')
      return false;
    }
  }

}
