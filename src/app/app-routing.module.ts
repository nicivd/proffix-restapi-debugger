import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionComponent } from './connection/connection.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/connection',
    pathMatch: 'full'
  },
  {
    path: 'connection', component: ConnectionComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'debugger',
    component: DebuggerComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [LoginGuard]
  },

  { path: '**', redirectTo: 'connection', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
