import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionComponent } from './connection/connection.component';
import { LoginComponent } from './login/login.component';
import { DebuggerComponent } from './debugger/debugger.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    LoginComponent,
    DebuggerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
