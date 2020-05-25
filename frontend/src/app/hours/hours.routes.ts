import { Routes } from '@angular/router';
import { HoursComponent } from './containers/hours/hours.component';
import { HourDetailComponent } from './components/hour-detail/hour-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: HoursComponent
  },
  {
    path: ':id',
    component: HourDetailComponent
  }
];
