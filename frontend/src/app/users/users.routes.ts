import { Routes } from '@angular/router';
import { UsersComponent } from './containers/users/users.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  {
    path: ':id',
    component: UserDetailComponent
  }
];
