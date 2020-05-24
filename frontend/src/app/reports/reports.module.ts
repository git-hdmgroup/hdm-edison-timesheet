import { NgModule } from '@angular/core';
import { ReportsComponent } from './containers/reports/reports.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './reports.routes';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportsModule { }
