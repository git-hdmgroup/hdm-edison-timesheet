import { NgModule } from '@angular/core';
import { UserProfileComponent } from './containers/user-profile/user-profile.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './user-profile.routes';



@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UserProfileModule { }
