import { Routes } from '@angular/router';
import { CostCentersComponent } from './containers/cost-centers/cost-centers.component';
import { CostCenterDetailComponent } from './components/cost-center-detail/cost-center-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: CostCentersComponent
  },
  {
    path: ':id',
    component: CostCenterDetailComponent
  }
];
