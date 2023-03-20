import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionComponent } from './connection/connection.component';
import { LoginComponent } from './login/login.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PxRestApiModule, PxConfiguration } from '@proffix/restapi-angular-library';
import { AppConfiguration } from './app.configuration';
import { ToastComponent } from './shared/toast/toast.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    LoginComponent,
    DebuggerComponent,
    NavbarComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    PxRestApiModule.forRoot(),
    NgxJsonViewerModule
  ],
  providers: [
    AppConfiguration,
    { provide: PxConfiguration, useExisting: AppConfiguration }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
