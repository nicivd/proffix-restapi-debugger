import { Injectable } from "@angular/core";
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { tap, mergeMap, finalize } from 'rxjs/operators';



import { PxHttpService } from '../http/px-http.service';
import { PxLogin } from './px-login.model';
import { PxConfiguration } from "../configuration/px-configuration";
import { PxLocalStorageService } from "../local-storage/px-local-storage.service";
import { PxError } from "../error/px-error.model";


/**
 * Login-Service zum ein- und ausloggen der Benutzer und Handling des AutoLogin.
 * Dieser Service ist nur eine Façade für dem AuthentificationInternalService.
 * Dieser darf nicht direkt verwendet werden wegen dem Risiko einer circular dependency.
 */
@Injectable()
export class PxLoginService {

  private static localstorageKeyAutoLogin = "PROFFIX.AutoLogin";

  endpoint = "PRO/Login";

  private login: PxLogin | null = null;
  private autoLogin: PxLogin | null = null;
  private loginSubject: BehaviorSubject<PxLogin | PxError | null> = new BehaviorSubject<PxLogin | PxError | null>(null);

  public constructor(
    private httpService: PxHttpService,
    private configuration: PxConfiguration,
    private localStorageService: PxLocalStorageService
  ) {
    const autoLogin = this.localStorageService.get(PxLoginService.localstorageKeyAutoLogin) as PxLogin;
    if (autoLogin) {
      this.autoLogin = autoLogin;
    }
  }

  /**
   * Observable des Login-Streams, wird jedesmal gefeuert wenn der Login (und der automatische AutoLogin) statt findet oder fehlschlägt
   * Bei erfolgreichem Login, befindet sich darin das PxLogin-Objekt, wenn der Login fehlschlägt wird ein Error geworfen.
   * Bei einem Logout oder wenn noch kein Login stattgefunden hat, wird null zurückgegeben.
   */
  public get loginObservable(): Observable<PxLogin | PxError | null> {
    return this.loginSubject.asObservable();
  }

  /**
   * Feuert einen Event in den Login-Stream
   * @param login Login-Objekt vom erfolgreichen Login oder null bei einem Logout
   */
  public fireLoginSuccessful(login: PxLogin | null | undefined) {
    if (login === null || login === undefined) {
      this.loginSubject.next(null);
    } else {
      // Object.setPrototypeOf(login, PxLogin.prototype);
      this.loginSubject.next(login);
    }
  }

  /**
   * Feuert einen Error-Event in den Login-Stream
   */
  public fireLoginError(error: PxError | null | undefined): void {
    if (error === null || error === undefined) {
      this.loginSubject.next(null);
    } else {
      // Object.setPrototypeOf(error, PxError);
      this.loginSubject.next(error);
    }
  }

  /**
   * Gibt zurück ob ein Login besteht
   */
  public get isLoggedIn(): boolean {
    return this.login != null &&
      (this.login as Object).hasOwnProperty("Datenbank") &&
      (this.login.Datenbank as Object).hasOwnProperty("Name");
  }

  /**
   * Gibt zurück ob das Auto-Login aktiviert ist.
   */
  public get isAutoLoginActive(): boolean {
    return this.autoLogin != null &&
      (this.autoLogin as Object).hasOwnProperty("Datenbank") &&
      (this.autoLogin.Datenbank as Object).hasOwnProperty("Name");
  }

  /**
   * Aktiviert den AutoLogin, die Daten werden im LocalStorage gespeichert und beim nächsten Login verwendet
   * @param login Login-Daten welche für den AutoLogin verwendet werden
   */
  public activateAutoLogin(login: PxLogin) {
    this.autoLogin = login;
    this.localStorageService.set(PxLoginService.localstorageKeyAutoLogin, login);
  }

  /**
 * Löscht und deaktiviert das AutoLogin
 */
  public removeAutoLogin() {
    this.localStorageService.remove(PxLoginService.localstorageKeyAutoLogin);
    this.autoLogin = null;
  }

  /**
   * Führt den Login aus, wenn kein Login-Objekt mitgegeben wird, werden die vom letzten Login gespeicherten Daten verwendet.
   * Wenn auch keine gespeicherten Daten vorhanden sind, werden allfällig gespeicherte AutoLogin-Daten verwendet.
   * @param login Login-Objekt falls kein Re- oder AutoLogin versucht wird
   * @param activateAutoLogin Bei true wird bei erfolgreichem Login der Auto Login aktiviert (bei false wird nichts gemacht)
   */
  public doLogin(login?: PxLogin, activateAutoLogin?: boolean): Observable<PxLogin> {
    // Falls kein Login-Objekt, zuletzt verwendeter Login- oder AutoLogin-Objekt verwenden
    if (login === undefined) {
      login = this.login || this.autoLogin || undefined
      if (login === undefined) {
        this.fireLoginError({ Endpoint: this.endpoint, Type: "GENERIC", Status: 401, Message: "No Login object availible" });
        return throwError(() => new Error()); // Kein Login gefunden, daher Fehler werfen
      }
    }

    // Benötigte Module aus der Configuration laden
    login.Module = this.configuration.requiredLicencedModules;

    // Login ausführen
    return this.httpService.post(this.endpoint, login).pipe(
      tap({
        error: error => this.fireLoginError(error)
      }),
      mergeMap((location: string) => this.httpService.get<PxLogin>(location)),
      tap({
        next: (newLogin: PxLogin) => {
          // Login erfolgreich das newLogin Object wird auf die lokale variable login gespeichert.
          if (login?.Passwort) {
            newLogin.Passwort = login.Passwort; // Passwort wird von der REST API entfernt, muss wieder eingefügt werden für AutoLogin
          }
          this.login = newLogin; // Neuer Login im Login-Service speichern (für ReLogin)
          this.fireLoginSuccessful(newLogin);
          if (activateAutoLogin) { this.activateAutoLogin(newLogin); }
        },
        error: error => {
          // Login fehlgeschlagen. Lokales login Object wird zurückgesetzt.
          this.login = null;
          this.fireLoginError(error);
        }
      }));
  }

  /**
   * Loggt den Benutzer aus (das AutoLogin wird nicht gelöscht)
   */
  public doLogout(): Observable<void> {
    return this.httpService.delete(this.endpoint).pipe(finalize(() => {
      this.fireLoginSuccessful(null);
      this.login = null;
    }));
  }
}
