import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PxHttpService } from '../http/px-http.service';
import { PxConnectionSettingsService } from '../connection-settings/px-connection-settings.service';
import { PxDatenbank } from './px-datenbank.model';

/**
 * Ruft Datenbanken aus /PRO/Datenbank ab
 */
@Injectable()
export class PxDatenbankService {
  public endpoint = "PRO/Datenbank";

  public constructor(
    private httpService: PxHttpService,
    private connectionSettingsService: PxConnectionSettingsService
  ) { }

  /**
   * Ruft alle Datenbanken ab
   *
   * @param additionalUrlParams Zusätzliche Parameter welche dem Aufruf mitgegeben werden können (optional)
   */
  public getAll(additionalUrlParams?: { [name: string]: string }): Observable<PxDatenbank[]> {
    if (!this.isIntialised()) {
      return new Observable<[]>
    }

    let paramsObj: { [name: string]: string } = {
      "key": this.connectionSettingsService.load().WebservicePasswortHash
    };
    if (additionalUrlParams) {
      paramsObj = { ...paramsObj, ...additionalUrlParams };
    }
    

    return this.httpService.get<PxDatenbank[]>(this.endpoint, paramsObj);
  }

  /**
   * Gibt 'true' zurück, falls eine 'WebServiceUrl' gesetzt wurde
   * 
   * @returns true if a web service url was set
   */
  public isIntialised(): boolean {
    let webServiceUrl = this.connectionSettingsService.load().WebserviceUrl

    return !(webServiceUrl == null || typeof(webServiceUrl) != 'string')
  }
}
