import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionComponent } from './connection/connection.component';
import { LoginComponent } from './login/login.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PxRestApiModule, PxConfiguration } from '@proffix/restapi-angular-library';
import { AppConfiguration } from './app.configuration';


@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    LoginComponent,
    DebuggerComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    PxRestApiModule.forRoot()
  ],
  providers: [
    AppConfiguration,
    { provide: PxConfiguration, useExisting: AppConfiguration }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
