import { NgModule } from '@angular/core';
import { LoginComponent } from './containers/login/login.component';
import { routes } from './login.routes';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class LoginModule { }
