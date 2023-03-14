import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionComponent } from './connection/connection.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', component: ConnectionComponent
  },
  {
    path: 'connection', component: ConnectionComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'debugger', component: DebuggerComponent
  },
  {
    path: '**', component: ConnectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
