import { NgModule } from '@angular/core';
import { CostCentersComponent } from './containers/cost-centers/cost-centers.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './cost-centers.routes';
import { CostCenterDetailComponent } from './components/cost-center-detail/cost-center-detail.component';

@NgModule({
  declarations: [CostCentersComponent, CostCenterDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CostCentersModule { }
