import { NgModule } from '@angular/core';
import { UsersComponent } from './containers/users/users.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './users.routes';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

@NgModule({
  declarations: [UsersComponent, UserDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule { }
