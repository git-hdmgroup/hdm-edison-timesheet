import { Routes } from '@angular/router';
import { CitiesComponent } from './containers/cities/cities.component';
import { CityDetailComponent } from './components/city-detail/city-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: CitiesComponent
  },
  {
    path: ':id',
    component: CityDetailComponent
  }
];
