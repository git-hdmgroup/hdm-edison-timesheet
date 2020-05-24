import { NgModule } from '@angular/core';
import { AdminComponent } from './containers/admin/admin.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './admin.routes';



@NgModule({
  declarations: [AdminComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
