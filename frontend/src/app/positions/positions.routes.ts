import { Routes } from '@angular/router';
import { PositionsComponent } from './containers/positions/positions.component';
import { PositionDetailComponent } from './components/position-detail/position-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: PositionsComponent
  },
  {
    path: ':id',
    component: PositionDetailComponent
  }
];
