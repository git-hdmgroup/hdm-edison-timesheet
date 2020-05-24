import { NgModule } from '@angular/core';
import { HoursComponent } from './containers/hours/hours.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './hours.routes';

@NgModule({
  declarations: [HoursComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HoursModule { }
